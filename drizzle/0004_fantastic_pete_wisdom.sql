ALTER TABLE "rdaily" ADD COLUMN "rain_daily" double precision;--> statement-breakpoint
ALTER TABLE "rdaily" ADD COLUMN "tma_daily" double precision;--> statement-breakpoint
ALTER TABLE "rdaily" ADD COLUMN "last_updated" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_pos_id_pos_id_fk" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;