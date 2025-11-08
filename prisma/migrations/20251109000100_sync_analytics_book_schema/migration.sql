-- Sync AnalyticsEvent schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'AnalyticsEvent'
      AND column_name = 'event'
  ) THEN
    ALTER TABLE "AnalyticsEvent"
    ADD COLUMN "event" TEXT;
  END IF;
END$$;

-- Sync Book schema
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Book'
      AND column_name = 'description'
  ) THEN
    ALTER TABLE "Book"
    ADD COLUMN "description" TEXT;
  END IF;
END$$;
