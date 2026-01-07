import { doublePrecision } from 'drizzle-orm/gel-core';
import { 
	pgTable, foreignKey, uniqueIndex, unique,
	serial, integer, text, timestamp, real, varchar, index, date, boolean, jsonb 
} from 'drizzle-orm/pg-core';

import { z } from 'zod'
/**
 * Table das untuk menyimpan data DAS (daerah aliran sungai)
 */
export const das = pgTable("das", {
	id: serial().primaryKey().notNull(),
	/** nama DAS, sesuai nama secara nasional dari BIG atau PUPR */
	nama: varchar({ length: 50 }).notNull(),
});

/**
 * Table pos untuk menyimpan data Pos pengamatan
 */
export const pos = pgTable("pos", {
	id: serial().primaryKey().notNull(),
	/** nama Pos, usahakan unik */
	nama: varchar({ length: 35 }).notNull(),
	/** koordinat longitude dan latitude */
	ll: varchar({ length: 60 }),
	/** tipe dari ARR ('1'), AWLR ('2'), Klimat('3') */
	tipe: varchar({ length: 3 }),
	/** elevasi dalam meter, bilangan bulat */
	elevasi: integer(),
	/** tanggal dan waktu sampling terakhir dari pos */
	latestSampling: timestamp("latest_sampling", { mode: 'string' }),
	/** tanggal dan waktu data terakhir diupdate */
	latestUp: timestamp("latest_up", { mode: 'string' }),
	/** id dari DAS (daerah aliran sungai) */
	dasId: integer("das_id"),
	/** nama sungai, wajib diisi untuk AWLR */
	sungai: varchar({ length: 30 }),
	/** batas siaga hijau */
	sh: real(),
	/** batas siaga kuning */
	sk: real(),
	/** batas siaga merah */
	sm: real(),
	/** nama desa lokasi pos */
	desa: varchar({ length: 30 }),
	/** nama kecamatan lokasi pos */
	kecamatan: varchar({ length: 30 }),
	/** nama kabupaten lokasi pos */
	kabupaten: varchar({ length: 30 }),
	/** kode register pos */
	register: varchar({ length: 20 }),
	/** tanggal data pos dibuat */
	cdate: timestamp({ mode: 'string' }).notNull(),
	/** tanggal data pos diubah */
	mdate: timestamp({ mode: 'string' }),
	/** orde sungai */
	orde: integer(),
}, (table) => [
	index("pos_das_id").using("btree", table.dasId.asc().nullsLast().op("int4_ops")),
	index("pos_nama").using("btree", table.nama.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.dasId],
			foreignColumns: [das.id],
			name: "pos_das_id_fkey"
		}),
]);

/**
 * Table manualdaily untuk menyimpan data manual harian dari petugas lapangan
 */
export const manualdaily = pgTable("manualdaily", {
	id: serial().primaryKey().notNull(),
	/** id dari pos */
	posId: integer("pos_id").notNull(),
	/** username yang mengisi data */
	username: varchar({ length: 20 }).notNull(),
	/** tanggal data */
	sampling: date().notNull(),
	/** curah hujan dalam mm, wajib isi jika pos.tipe == '1' atau '3' */
	ch: real(),
	/** TMA 3 data [{jam: 7, tma: 324}, ], wajib isi jika pos.tipe == '2' */
	tma: text(),
	/** tanggal data diinput */
	cdate: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("manualdaily_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("manualdaily_pos_id_sampling").using("btree", table.posId.asc().nullsLast().op("int4_ops"), table.sampling.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "manualdaily_pos_id_fkey"
		}),
]);

/**
 * Table rdaily untuk menyimpan data harian dari Data Logger (telemetri)
 */
export const rdaily = pgTable("rdaily", {
	id: serial().primaryKey().notNull(),
	/** id dari pos */
	posId: integer("pos_id"),
	/** kode vendor 'A', 'B', 'C' */
	source: varchar({ length: 3 }).notNull(),
	/** nama / identitas Data Logger, contoh untuk primabot '2512-1' */
	nama: varchar({ length: 50 }).notNull(),
	/** tanggal data */
	sampling: date().notNull(),
	/** data hasil konversi dari data logger dalam bentuk JSON, berupa list of object */
	raw: jsonb("raw").$type<any[]>().notNull().default([]),
	rainDaily: doublePrecision("rain_daily"),
	tmaDaily: doublePrecision("tma_daily"),
	lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
	index("rdaily_nama").using("btree", table.nama.asc().nullsLast().op("text_ops")),
	uniqueIndex("rdaily_nama_sampling").using("btree", table.nama.asc().nullsLast().op("date_ops"), table.sampling.asc().nullsLast().op("text_ops")),
	index("rdaily_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	index("rdaily_sampling").using("btree", table.sampling.asc().nullsLast().op("date_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "rdaily_pos_id_fkey"
		}),
]);

/**
 * Table petugas untuk menyimpan data personal (Sesuai KTP) petugas lapangan
 */
export const petugas = pgTable("petugas", {
	id: serial().primaryKey().notNull(),
	/** nama sesuai KTP */
	nama: varchar({ length: 50 }).notNull(),
	/** nomor induk kependudukan */
	nik: varchar({ length: 20 }),
	/** nomor handphone, sebaiknya isi */
	hp: varchar({ length: 20 }),
	dusun: varchar({ length: 50 }),
	rt: integer(),
	rw: integer(),
	desa: varchar({ length: 20 }),
	kecamatan: varchar({ length: 20 }),
	kabupaten: varchar({ length: 20 }),
	pendidikan: varchar({ length: 5 }),
	/** id dari pos */
	posId: integer("pos_id"),
	/** tipe petugas, ARR: '1', AWLR:'2', Klimat:'3' */
	tipe: varchar({ length: 2 }),
	/** username untuk relasi ke table user */
	username: varchar({ length: 20 }),
}, (table) => [
	index("petugas_nama").using("btree", table.nama.asc().nullsLast().op("text_ops")),
	index("petugas_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "petugas_pos_id_fkey"
		}),
]);

/**
 * Table device untuk menyimpan data Pos vendor
 */
export const device = pgTable("device", {
	id: serial().primaryKey().notNull(),
	/** id dari pos */
	posId: integer("pos_id").references(() => pos.id),
	/** nama atau kode harusnya UNIK dari Pos Vendor */
	nama: varchar({ length: 50 }).notNull(),
	/** tipe dari ARR ('1'), AWLR ('2'), Klimat('3') */
	tipe: varchar({ length: 10 }),
	/** tanggal sampling terakhir */
	latestSampling: timestamp("latest_sampling", { mode: 'string' }).notNull(),
	/** kode vendor 'A', 'B', 'C' */
	source: varchar({ length: 3 }).notNull(),
	/** ini aktif atau tidak */
	aktif: boolean().notNull(),
}, (table) => [
	index("device_latest_sampling").using("btree", table.latestSampling.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("device_nama").using("btree", table.nama.asc().nullsLast().op("text_ops")),
	index("device_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "device_pos_id_fkey"
		}),
]);

/**
 * Table hasilujikualitasair untuk menyimpan data hasil uji kualitas air
 */
export const hasilujikualitasair = pgTable("hasilujikualitasair", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id"),
	sampling: date().notNull(),
	ll: varchar({ length: 60 }),
	docPath: varchar("doc_path", { length: 255 }),
	lembaga: varchar({ length: 50 }),
	username: varchar({ length: 20 }),
	cdate: timestamp({ mode: 'string' }).notNull(),
	statusHasilUji: varchar("status_hasil_uji", { length: 20 }),
}, (table) => [
	index("hasilujikualitasair_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "hasilujikualitasair_pos_id_fkey"
		}),
]);

/**
 * Table notes untuk menyimpan catatan/komentasr/diskusi terkait objek tertentu
 */
export const notes = pgTable("notes", {
	id: serial().primaryKey().notNull(),
	/** username dari user yang membuat catatan */
	username: varchar({ length: 20 }).notNull(),
	/** tanggal pembuatan catatan */
	cdate: timestamp({ mode: 'string' }).notNull(),
	/** isi catatan */
	msg: text().notNull(),
	/** nama objek table (pos, petugas, opos) */
	objName: varchar("obj_name", { length: 255 }).notNull(),
	/** id dari objek */
	objId: integer("obj_id").notNull(),
	/** id dari parent catatan */
	parentId: integer("parent_id"),
});

/**
 * Table posmap untuk memetakan pos ke nama opos vendor
 */
export const posmap = pgTable("posmap", {
	id: serial().primaryKey().notNull(),
	/** id dari pos */
	posId: integer("pos_id").notNull(),
	/** nama opos vendor */
	nama: varchar({ length: 60 }).notNull(),
}, (table) => [
	uniqueIndex("posmap_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "posmap_pos_id_fkey"
		}),
]);

/**
 * Table lengkungdebit untuk menyimpan data lengkung debit dari pos AWLR
 */
export const lengkungdebit = pgTable("lengkungdebit", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id").notNull(),
	/** versi dari lengkung debit, berisi tanggal terbit */
	versi: date().notNull(),
	/** parameter c */
	c: real("c_").notNull(),
	/** parameter a */
	a: real("a_").notNull(),
	/** parameter b */
	b: real("b_").notNull(),
	cdate: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	index("lengkungdebit_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "lengkungdebit_pos_id_fkey"
		}),
]);

/**
 * Table publikasi untuk menyimpan data publikasi hasil analisis, contoh kekeringan
 */
export const publikasi = pgTable("publikasi", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	content: text().notNull(),
	filename: varchar({ length: 100 }),
	tags: varchar({ length: 100 }),
	sampling: date(),
	cdate: timestamp({ mode: 'string' }).notNull(),
	thumbnailBase64: text("thumbnail_base64"),
}, (table) => [
	index("publikasi_title").using("btree", table.title.asc().nullsLast().op("text_ops")),
	uniqueIndex("publikasi_title_sampling").using("btree", table.title.asc().nullsLast().op("date_ops"), table.sampling.asc().nullsLast().op("date_ops")),
]);

/**
 * Table user untuk menyimpan data user aplikasi
 */
export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	age: integer(),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	// Kolom baru 1: posId (integer, nullable, foreign key)
    posId: integer("pos_id").references(() => pos.id), 

    // Kolom baru 2: admin (boolean, default false, tidak boleh null)
    isAdmin: boolean("is_admin").default(false).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
	unique("user_username_unique").on(table.username),
]);

/**
 * Table session untuk menyimpan data session user aplikasi
 */
export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'date' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}),
]);

// B. Skema Registrasi (Apa yang diminta dari User)
export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8), // User mengisi 'password'
    confirmPassword: z.string()  // Kita bisa tambah field yang tidak ada di DB
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"]
});

// Skema untuk Form (Login)
export const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});


export type Das = typeof das.$inferSelect;
export type Pos = typeof pos.$inferSelect;
export type ManualDaily = typeof manualdaily.$inferSelect;
export type RDaily = typeof rdaily.$inferSelect;
export type Petugas = typeof petugas.$inferSelect;
export type OPos = typeof device.$inferSelect;
export type HasilUjiKualitasAir = typeof hasilujikualitasair.$inferSelect;
export type Notes = typeof notes.$inferSelect;
export type PosMap = typeof posmap.$inferSelect;
export type LengkungDebit = typeof lengkungdebit.$inferSelect;
export type Publikasi = typeof publikasi.$inferSelect;
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
