CREATE TABLE IF NOT EXISTS "das" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hasilujikualitasair" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer,
	"sampling" date NOT NULL,
	"ll" varchar(60),
	"doc_path" varchar(255),
	"lembaga" varchar(50),
	"username" varchar(20),
	"cdate" timestamp NOT NULL,
	"status_hasil_uji" varchar(20)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lengkungdebit" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer NOT NULL,
	"versi" date NOT NULL,
	"c_" real NOT NULL,
	"a_" real NOT NULL,
	"b_" real NOT NULL,
	"cdate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "manualdaily" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer NOT NULL,
	"username" varchar(20) NOT NULL,
	"sampling" date NOT NULL,
	"ch" real,
	"tma" text,
	"cdate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"cdate" timestamp NOT NULL,
	"msg" text NOT NULL,
	"obj_name" varchar(255) NOT NULL,
	"obj_id" integer NOT NULL,
	"parent_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opos" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer,
	"nama" varchar(50) NOT NULL,
	"tipe" varchar(10),
	"latest_sampling" timestamp NOT NULL,
	"source" varchar(3) NOT NULL,
	"aktif" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "petugas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(50) NOT NULL,
	"nik" varchar(20),
	"hp" varchar(20),
	"dusun" varchar(50),
	"rt" integer,
	"rw" integer,
	"desa" varchar(20),
	"kecamatan" varchar(20),
	"kabupaten" varchar(20),
	"pendidikan" varchar(5),
	"pos_id" integer,
	"tipe" varchar(2),
	"username" varchar(20)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(35) NOT NULL,
	"ll" varchar(60),
	"tipe" varchar(3),
	"elevasi" integer,
	"latest_sampling" timestamp,
	"latest_up" timestamp,
	"das_id" integer,
	"sungai" varchar(30),
	"sh" real,
	"sk" real,
	"sm" real,
	"desa" varchar(30),
	"kecamatan" varchar(30),
	"kabupaten" varchar(30),
	"register" varchar(20),
	"cdate" timestamp NOT NULL,
	"mdate" timestamp,
	"orde" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posmap" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer NOT NULL,
	"nama" varchar(60) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publikasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"filename" varchar(100),
	"tags" varchar(100),
	"sampling" date,
	"cdate" timestamp NOT NULL,
	"thumbnail_base64" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rdaily" (
	"id" serial PRIMARY KEY NOT NULL,
	"pos_id" integer,
	"source" varchar(3) NOT NULL,
	"nama" varchar(50) NOT NULL,
	"sampling" date NOT NULL,
	"raw" text NOT NULL
);
--> statement-breakpoint
--ALTER TABLE "user" ADD COLUMN "pos_id" integer;--> statement-breakpoint
--ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
--ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
--ALTER TABLE "hasilujikualitasair" ADD CONSTRAINT "hasilujikualitasair_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "lengkungdebit" ADD CONSTRAINT "lengkungdebit_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "manualdaily" ADD CONSTRAINT "manualdaily_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "opos" ADD CONSTRAINT "opos_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "petugas" ADD CONSTRAINT "petugas_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "pos" ADD CONSTRAINT "pos_das_id_fkey" FOREIGN KEY ("das_id") REFERENCES "public"."das"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "posmap" ADD CONSTRAINT "posmap_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "rdaily" ADD CONSTRAINT "rdaily_pos_id_fkey" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hasilujikualitasair_pos_id" ON "hasilujikualitasair" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lengkungdebit_pos_id" ON "lengkungdebit" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "manualdaily_pos_id" ON "manualdaily" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "manualdaily_pos_id_sampling" ON "manualdaily" USING btree ("pos_id" int4_ops,"sampling" date_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "opos_latest_sampling" ON "opos" USING btree ("latest_sampling" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "opos_nama" ON "opos" USING btree ("nama" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "opos_pos_id" ON "opos" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "petugas_nama" ON "petugas" USING btree ("nama" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "petugas_pos_id" ON "petugas" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pos_das_id" ON "pos" USING btree ("das_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pos_nama" ON "pos" USING btree ("nama" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "posmap_pos_id" ON "posmap" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "publikasi_title" ON "publikasi" USING btree ("title" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "publikasi_title_sampling" ON "publikasi" USING btree ("title" text_ops,"sampling" date_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rdaily_nama" ON "rdaily" USING btree ("nama" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rdaily_nama_sampling" ON "rdaily" USING btree ("nama" text_ops,"sampling" date_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rdaily_pos_id" ON "rdaily" USING btree ("pos_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rdaily_sampling" ON "rdaily" USING btree ("sampling" date_ops);--> statement-breakpoint
--ALTER TABLE "user" ADD CONSTRAINT "user_pos_id_pos_id_fk" FOREIGN KEY ("pos_id") REFERENCES "public"."pos"("id") ON DELETE no action ON UPDATE no action;