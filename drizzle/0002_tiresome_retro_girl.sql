ALTER TABLE "rdaily" ALTER COLUMN "raw" TYPE jsonb USING raw::jsonb;--> statement-breakpoint
ALTER TABLE "rdaily" ALTER COLUMN "raw" SET DEFAULT '[]'::jsonb;