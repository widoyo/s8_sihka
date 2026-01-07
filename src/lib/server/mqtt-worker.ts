// src/lib/server/mqtt-worker.ts
import mqtt from 'mqtt';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './db/schema'; // Import schema yang sudah ada
import * as relations from './db/relations';
import { eq, sql } from 'drizzle-orm';
import { late } from 'zod/v3';
import { RDailyService } from './services/rdaily.service';

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
        const source = 'SB';
        const posId = await RDailyService.getPosId(db, sn, source);

        const sampling: Date = new Date(payload.sampling * 1000);
        console.log('Sampling:', sampling);
        // Simpan ke DB menggunakan schema SvelteKit

        await RDailyService.upsertDailyData(db, {
            posId: posId,
            nama: sn,
            source: source,
            sampling: sampling,
            payload: payload
        });

        if (payload.tick != null) {
          const hour = sampling.getHours();
          let targetDate = RDailyService.formatToLocalDate(sampling);
          
          if (hour < 7) {
              const yesterday = new Date(sampling);
              yesterday.setDate(sampling.getDate() - 1);
              targetDate = RDailyService.formatToLocalDate(yesterday);
          }

          await RDailyService.updateRainAccumulation(db, sn, targetDate);

          console.log(`📊 [${sn}] Rain Updated for ${targetDate}`);
        }
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
