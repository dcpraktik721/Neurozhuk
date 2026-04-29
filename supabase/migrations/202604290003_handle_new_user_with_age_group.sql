CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_display_name TEXT;
  v_age_group TEXT;
BEGIN
  v_display_name := COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1));
  v_age_group := COALESCE(NEW.raw_user_meta_data ->> 'age_group', 'adult');

  IF v_age_group NOT IN ('child', 'adult') THEN
    v_age_group := 'adult';
  END IF;

  INSERT INTO public.profiles (id, display_name, age_group)
  VALUES (NEW.id, v_display_name, v_age_group)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
