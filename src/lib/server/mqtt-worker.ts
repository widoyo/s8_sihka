// src/lib/server/mqtt-worker.ts
import mqtt from 'mqtt';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './db/schema'; // Import schema yang sudah ada
import * as relations from './db/relations';
import { eq, sql } from 'drizzle-orm';
import { late } from 'zod/v3';

// Load .env manual agar process.env terisi
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}

// Inisialisasi DB khusus untuk Worker (Standalone)
const client = postgres(databaseUrl);
const db = drizzle(client, { schema: {...schema, ...relations} });

// Setup MQTT
const mqttClient = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883');
const mqttTopic = process.env.MQTT_TOPIC || 'sensors/data';

mqttClient.on('connect', () => {
    console.log('✅ MQTT Worker terhubung!');
    mqttClient.subscribe(mqttTopic); // Contoh topik
    console.log(`✅ Berlangganan topik: ${mqttTopic}`);
});

mqttClient.on('message', async (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        const sn = getBotId(payload.device);
        if (!sn) {
            console.warn('⚠️ Format device tidak valid:', payload.device);
            return;
        }
        const posId = await getPosId(db, sn);
        console.log('Serial Number:', sn);
        console.log('Pos ID:', posId);

        const sampling: Date = new Date(payload.sampling * 1000);
        console.log('Sampling:', sampling);
        // Simpan ke DB menggunakan schema SvelteKit
        
        await upsertRemoteDailyData(db, posId, sn, 'SB', sampling, payload);

        
    } catch (err) {
        console.error('❌ Gagal simpan data:', err);
    }
});

/**
 * Validates the bot string and returns only the middle ID (xxxx-x)
 * @param input The string to parse (e.g., "primaBot/2512-2/0.9")
 * @returns The middle ID string if valid, otherwise null
 */
function getBotId(input: string): string | null {
  // Regex Breakdown:
  // ^[^/]+      : Start with any chars except /
  // \/          : First slash
  // (\d{4}-\d)  : CAPTURE GROUP 1: 4 digits, hyphen, 1 digit
  // \/          : Second slash
  // [^/]+$      : End with any chars except /
  const pattern = /^[^/]+\/(\d{4}-\d)\/[^/]+$/;

  const match = input.match(pattern);

  // match[0] is the full string
  // match[1] is the content of the first capture group (xxxx-x)
  return match ? match[1] : null;
}

/**
 * Insert or Update Remote Daily Data
 * @param db 
 * @param newData 
 */
async function upsertRemoteDailyData(db: any, posId: number|null, nama: string, source: string, sampling: Date, raw: any) {

  const localDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', // GMT+7
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(sampling));

  await db.insert(schema.rdaily)
    .values({
      posId: posId,
      source: source,
      nama: nama,
      sampling: localDate,
      raw: [raw],
    })
    .onConflictDoUpdate({
      target: [schema.rdaily.nama, schema.rdaily.sampling], // The unique constraint
      set: { 
        raw: sql`${schema.rdaily.raw} || excluded.raw`,
        posId: posId
      },
    });
}

/**
 * Get posId from device table by nama
 * @param db 
 * @returns 
 */
async function getPosId(db: any, nama: string): Promise<number|null> {
  const result = await db
    .select({ 
      posId: schema.device.posId
    })
    .from(schema.device)
    .where(eq(schema.device.nama, nama))
    .limit(1);

  // Jika tidak ada, bisa insert sebagai device baru
  if (result.length === 0) {
    const insertResult = await db
      .insert(schema.device)
      .values({
        nama: nama,
        aktif: true, 
        latestSampling: new Date().toISOString(),
        source: 'SB'
      });
    
  }
  // result will be an array like [{ id: 123 }] or []
  console.log('getOposId result:', result[0]);
  return result.length > 0 ? result[0].posId : null;
}