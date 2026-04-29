DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'game_sessions_mode_check'
      AND conrelid = 'public.game_sessions'::regclass
  ) THEN
    ALTER TABLE public.game_sessions
      DROP CONSTRAINT game_sessions_mode_check;
  END IF;
END $$;

ALTER TABLE public.game_sessions
  ADD CONSTRAINT game_sessions_mode_check
  CHECK (mode IN ('normal', 'timed', 'practice'));
