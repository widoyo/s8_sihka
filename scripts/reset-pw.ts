// scripts/reset-pw.ts
import 'dotenv/config';
import { hash } from "@node-rs/argon2";
import { drizzle } from "drizzle-orm/postgres-js"; // Atau driver yang Anda pakai
import postgres from "postgres";
import { user } from "../src/lib/server/db/schema";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL; 

if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan di .env");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function reset() {
    // Mengambil argumen dari terminal: npx tsx script.ts [username] [password]
    const username = process.argv[2];
    const newPassword = process.argv[3];

    if (!username || !newPassword) {
        console.error("❌ Error: Gunakan format -> npx tsx scripts/reset-pw.ts [username] [password]");
        process.exit(1);
    }

    try {
        console.log(`\n🔄 Sedang memproses reset untuk user: ${username}...`);
        
        const passwordHash = await hash(newPassword);

        const result = await db.update(user)
            .set({ passwordHash })
            .where(eq(user.username, username))
            .returning({ updatedId: user.id });

        if (result.length === 0) {
            console.error("⚠️  Gagal: User tidak ditemukan di database.");
        } else {
            console.log(`✅ Sukses! Password untuk ID: ${result[0].updatedId} telah diperbarui.`);
        }
    } catch (error) {
        console.error("❌ Terjadi kesalahan:", error);
    } finally {
        process.exit(0);
    }
}

reset();