import { relations } from "drizzle-orm/relations";
import { das, pos, manualdaily, rdaily, petugas, device, hasilujikualitasair, posmap, lengkungdebit, user, session } from "./schema";


export const posRelations = relations(pos, ({one, many}) => ({
	da: one(das, {
		fields: [pos.dasId],
		references: [das.id]
	}),
	manualdailies: many(manualdaily),
	rdailies: many(rdaily),
	petugases: many(petugas),
	device: many(device),
	hasilujikualitasairs: many(hasilujikualitasair),
	posmaps: many(posmap),
	lengkungdebits: many(lengkungdebit),
	petugas: many(user),
}));

export const dasRelations = relations(das, ({many}) => ({
	pos: many(pos),
}));

export const manualdailyRelations = relations(manualdaily, ({one}) => ({
	po: one(pos, {
		fields: [manualdaily.posId],
		references: [pos.id]
	}),
}));

export const rdailyRelations = relations(rdaily, ({one}) => ({
	po: one(pos, {
		fields: [rdaily.posId],
		references: [pos.id]
	}),
}));

export const petugasRelations = relations(petugas, ({one}) => ({
	po: one(pos, {
		fields: [petugas.posId],
		references: [pos.id]
	}),
}));

export const deviceRelations = relations(device, ({one}) => ({
	pos: one(pos, {
		fields: [device.posId],
		references: [pos.id]
	}),
}));

export const hasilujikualitasairRelations = relations(hasilujikualitasair, ({one}) => ({
	po: one(pos, {
		fields: [hasilujikualitasair.posId],
		references: [pos.id]
	}),
}));

export const posmapRelations = relations(posmap, ({one}) => ({
	po: one(pos, {
		fields: [posmap.posId],
		references: [pos.id]
	}),
}));

export const lengkungdebitRelations = relations(lengkungdebit, ({one}) => ({
	po: one(pos, {
		fields: [lengkungdebit.posId],
		references: [pos.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({one,many}) => ({
	sessions: many(session),
	pos: one(pos, {
		fields: [user.posId],
		references: [pos.id],
	}),

}));