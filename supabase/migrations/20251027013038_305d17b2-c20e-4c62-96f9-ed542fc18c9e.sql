-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_level INTEGER DEFAULT 1,
  avatar_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  refill_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own medications"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
  ON public.medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
  ON public.medications FOR DELETE
  USING (auth.uid() = user_id);

-- Create medication logs table
CREATE TABLE public.medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT
);

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own medication logs"
  ON public.medication_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication logs"
  ON public.medication_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create badges table (predefined achievements)
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create mood logs table
CREATE TABLE public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs"
  ON public.mood_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood logs"
  ON public.mood_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create side effects table
CREATE TABLE public.side_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  effect TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.side_effects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own side effects"
  ON public.side_effects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own side effects"
  ON public.side_effects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create medication interactions table
CREATE TABLE public.medication_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name_1 TEXT NOT NULL,
  medication_name_2 TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  description TEXT NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(medication_name_1, medication_name_2)
);

ALTER TABLE public.medication_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view medication interactions"
  ON public.medication_interactions FOR SELECT
  USING (true);

-- Create caregiver relationships table
CREATE TABLE public.caregiver_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dependent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(caregiver_id, dependent_id)
);

ALTER TABLE public.caregiver_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caregivers can view their relationships"
  ON public.caregiver_relationships FOR SELECT
  USING (auth.uid() = caregiver_id OR auth.uid() = dependent_id);

CREATE POLICY "Users can create caregiver relationships"
  ON public.caregiver_relationships FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id OR auth.uid() = dependent_id);

CREATE POLICY "Users can update their relationships"
  ON public.caregiver_relationships FOR UPDATE
  USING (auth.uid() = caregiver_id OR auth.uid() = dependent_id);

-- Allow caregivers to view dependent's medications
CREATE POLICY "Caregivers can view dependent medications"
  ON public.medications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_relationships
      WHERE caregiver_id = auth.uid()
        AND dependent_id = medications.user_id
        AND status = 'active'
    )
  );

-- Allow caregivers to view dependent's medication logs
CREATE POLICY "Caregivers can view dependent medication logs"
  ON public.medication_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_relationships
      WHERE caregiver_id = auth.uid()
        AND dependent_id = medication_logs.user_id
        AND status = 'active'
    )
  );

-- Create pharmacy refills table
CREATE TABLE public.pharmacy_refills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  pharmacy_name TEXT NOT NULL,
  pharmacy_phone TEXT,
  refill_status TEXT NOT NULL DEFAULT 'pending' CHECK (refill_status IN ('pending', 'requested', 'ready', 'picked_up')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ready_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.pharmacy_refills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pharmacy refills"
  ON public.pharmacy_refills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pharmacy refills"
  ON public.pharmacy_refills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pharmacy refills"
  ON public.pharmacy_refills FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
  ('First Dose', 'Took your first medication', 'star', 'medications_taken', 1),
  ('3 Day Streak', 'Maintained a 3-day streak', 'flame', 'streak_days', 3),
  ('Week Warrior', 'Maintained a 7-day streak', 'trophy', 'streak_days', 7),
  ('Month Master', 'Maintained a 30-day streak', 'crown', 'streak_days', 30),
  ('100 Strong', 'Took 100 medications', 'medal', 'medications_taken', 100),
  ('Mood Tracker', 'Logged 10 mood entries', 'heart', 'mood_logs', 10),
  ('Self Care Star', 'Logged 50 mood entries', 'sparkles', 'mood_logs', 50);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.medications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medication_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_badges;