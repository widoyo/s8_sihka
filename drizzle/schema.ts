import { pgTable, serial, varchar, index, foreignKey, integer, timestamp, real, uniqueIndex, date, text, boolean, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const das = pgTable("das", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 50 }).notNull(),
});

export const pos = pgTable("pos", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 35 }).notNull(),
	ll: varchar({ length: 60 }),
	tipe: varchar({ length: 3 }),
	elevasi: integer(),
	latestSampling: timestamp("latest_sampling", { mode: 'string' }),
	latestUp: timestamp("latest_up", { mode: 'string' }),
	dasId: integer("das_id"),
	sungai: varchar({ length: 30 }),
	sh: real(),
	sk: real(),
	sm: real(),
	desa: varchar({ length: 30 }),
	kecamatan: varchar({ length: 30 }),
	kabupaten: varchar({ length: 30 }),
	register: varchar({ length: 20 }),
	cdate: timestamp({ mode: 'string' }).notNull(),
	mdate: timestamp({ mode: 'string' }),
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

export const manualdaily = pgTable("manualdaily", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id").notNull(),
	username: varchar({ length: 20 }).notNull(),
	sampling: date().notNull(),
	ch: real(),
	tma: text(),
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

export const rdaily = pgTable("rdaily", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id"),
	source: varchar({ length: 3 }).notNull(),
	nama: varchar({ length: 50 }).notNull(),
	sampling: date().notNull(),
	raw: text().notNull(),
	dataCount: integer("data_count").notNull(),
	mRain: real("m_rain"),
	mWlevel7: real("m_wlevel_7"),
	mWlevel12: real("m_wlevel_12"),
	mWlevel17: real("m_wlevel_17"),
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

export const petugas = pgTable("petugas", {
	id: serial().primaryKey().notNull(),
	nama: varchar({ length: 50 }).notNull(),
	nik: varchar({ length: 20 }),
	hp: varchar({ length: 20 }),
	dusun: varchar({ length: 50 }),
	rt: integer(),
	rw: integer(),
	desa: varchar({ length: 20 }),
	kecamatan: varchar({ length: 20 }),
	kabupaten: varchar({ length: 20 }),
	pendidikan: varchar({ length: 5 }),
	posId: integer("pos_id"),
	tipe: varchar({ length: 2 }),
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

export const opos = pgTable("opos", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id"),
	nama: varchar({ length: 50 }).notNull(),
	tipe: varchar({ length: 10 }),
	latestSampling: timestamp("latest_sampling", { mode: 'string' }).notNull(),
	source: varchar({ length: 3 }).notNull(),
	aktif: boolean().notNull(),
}, (table) => [
	index("opos_latest_sampling").using("btree", table.latestSampling.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("opos_nama").using("btree", table.nama.asc().nullsLast().op("text_ops")),
	index("opos_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "opos_pos_id_fkey"
		}),
]);

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

export const notes = pgTable("notes", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 20 }).notNull(),
	cdate: timestamp({ mode: 'string' }).notNull(),
	msg: text().notNull(),
	objName: varchar("obj_name", { length: 255 }).notNull(),
	objId: integer("obj_id").notNull(),
	parentId: integer("parent_id"),
});

export const posmap = pgTable("posmap", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id").notNull(),
	nama: varchar({ length: 60 }).notNull(),
}, (table) => [
	uniqueIndex("posmap_pos_id").using("btree", table.posId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.posId],
			foreignColumns: [pos.id],
			name: "posmap_pos_id_fkey"
		}),
]);

export const lengkungdebit = pgTable("lengkungdebit", {
	id: serial().primaryKey().notNull(),
	posId: integer("pos_id").notNull(),
	versi: date().notNull(),
	c: real("c_").notNull(),
	a: real("a_").notNull(),
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

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	age: integer(),
	username: text().notNull(),
	passwordHash: text("password_hash").notNull(),
}, (table) => [
	unique("user_username_unique").on(table.username),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}),
]);
