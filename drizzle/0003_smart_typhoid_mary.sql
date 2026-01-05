ALTER TABLE "opos" RENAME TO "device";--> statement-breakpoint
ALTER TABLE "device" DROP CONSTRAINT "opos_pos_id_fkey";
--> statement-breakpoint
DROP INDEX "opos_latest_sampling";--> statement-breakpoint
DROP INDEX "opos_nama";--> statement-breakpoint
DROP INDEX "opos_pos_id";--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_latest_sampling" ON "device" USING btree ("latest_sampling" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "device_nama" ON "device" USING btree ("nama" text_ops);--> statement-breakpoint
CREATE INDEX "device_pos_id" ON "device" USING btree ("pos_id" int4_ops);