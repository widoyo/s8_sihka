import { eq, and, or, sql } from 'drizzle-orm';
import { rdaily, device } from '../db/schema';

export const RDailyService = {
  /**
   * Update timestamp terakhir device aktif
   */
  async updateDeviceHeartbeat(db: any, nama: string, timestamp: Date) {
    await db.update(device)
      .set({ latestSampling: timestamp.toISOString() })
      .where(eq(device.nama, nama));
  },

  /**
   * Menghitung akumulasi hujan standar BMKG (07:00 - 06:55)
   * Dan menyimpannya ke database
   */
  async updateRainAccumulation(db: any, nama: string, dateStr: string) {
    // 1. Dapatkan tanggal besok
    const today = new Date(dateStr);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = this.formatToLocalDate(tomorrow);

    // 2. Ambil data hari ini dan besok
    const records = await db.select()
      .from(rdaily)
      .where(
        and(
          eq(rdaily.nama, nama),
          or(eq(rdaily.sampling, dateStr), eq(rdaily.sampling, tomorrowStr))
        )
      );

    let totalRain = 0;

    records.forEach((record: any) => {
      if (!Array.isArray(record.raw)) return;      
      record.raw.forEach((entry: any) => {
        if (entry.tick == null) return;
        // payload.sampling adalah UNIX Timestamp (detik)
        const entryDate = new Date(entry.sampling * 1000);
        
        // Gunakan Intl untuk mendapatkan jam di zona waktu Jakarta (WIB)
        const hour = parseInt(new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false 
        }).format(entryDate));

        const entryDateStr = this.formatToLocalDate(entryDate);

        // LOGIKA FILTER:
        // Jika di baris 'Hari ini': ambil data jam >= 07:00
        if (entryDateStr === dateStr && hour >= 7) {
          totalRain += (entry.tick * entry.tipping_factor || 0);
        }
        // Jika di baris 'Besok': ambil data jam < 07:00
        else if (entryDateStr === tomorrowStr && hour < 7) {
          totalRain += (entry.tick * entry.tipping_factor || 0);
        }
      });
    });

    // 3. Simpan hasil ke kolom rainDaily di baris 'Hari ini'
    await db.update(rdaily)
      .set({ 
        rainDaily: parseFloat(totalRain.toFixed(1)), // Pembulatan 1 desimal
        lastUpdated: new Date() 
      })
      .where(and(eq(rdaily.nama, nama), eq(rdaily.sampling, dateStr)));
      
    return totalRain;
  },

  /**
   * Mengonversi Date ke string YYYY-MM-DD sesuai zona waktu Jakarta
   */
  formatToLocalDate(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  },

  /**
   * Mendapatkan posId dari tabel device. Jika device belum ada, buat device baru.
   */
  async getPosId(db: any, nama: string, source: string = 'SB'): Promise<number | null> {
    const [existing] = await db
      .select({ posId: device.posId })
      .from(device)
      .where(eq(device.nama, nama))
      .limit(1);

    if (existing) {
        existing.latestSampling = new Date().toISOString();
        await db.update(device)
          .set({ latestSampling: existing.latestSampling })
          .where(eq(device.posId, existing.posId));

        return existing.posId;
    }
        

    // Jika tidak ada, insert sebagai device baru
    await db.insert(device).values({
      nama: nama,
      aktif: true,
      latestSampling: new Date().toISOString(),
      source: source
    })
    .onConflictDoNothing(); // Safety jika ada race condition

    return null; // Atau return default ID jika ada
  },

  /**
   * Upsert data harian dan append raw data
   */
  async upsertDailyData(db: any, params: {
    posId: number | null,
    nama: string,
    source: string,
    sampling: Date,
    payload: any
  }) {
    const localDate = this.formatToLocalDate(params.sampling);

    return await db.insert(rdaily)
      .values({
        //posId: params.posId,
        source: params.source,
        nama: params.nama,
        sampling: localDate,
        raw: [params.payload],
      })
      .onConflictDoUpdate({
        target: [rdaily.nama, rdaily.sampling],
        set: {
          raw: sql`${rdaily.raw} || excluded.raw`,
          posId: params.posId
        },
      });
  }
};