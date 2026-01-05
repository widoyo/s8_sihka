import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '$lib/server/db';
import { user, session as session_main } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

describe('Auth & Database Integration', () => {
    
    it('harus bisa membuat user baru dan membuat session di database', async () => {
        const testUserId = crypto.randomUUID();

        afterEach(async () => {
            if (testUserId) {
                // Hapus session dulu jika tidak pakai CASCADE, lalu user
                await db.delete(session_main).where(eq(session_main.userId, testUserId));
                await db.delete(user).where(eq(user.id, testUserId));
            }
        });        
        // 1. Simpan user ke DB menggunakan Drizzle
        await db.insert(user).values({
            id: testUserId,
            username: "testuser",
            passwordHash: "hashed_password_here"
        });

        // 2. Buat session menggunakan Lucia
        const session = await lucia.createSession(testUserId, {});

        // 3. Verifikasi: Apakah session benar-benar ada di DB?
        const [dbUser] = await db.select().from(user).where(eq(user.id, testUserId));
        
        expect(dbUser).toBeDefined();
        expect(dbUser.username).toBe("testuser");
        expect(session.userId).toBe(testUserId);

    });
});