import { db } from '$lib/server/db';
import { device } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const allDevices = await db.query.device.findMany({
        with: {
            pos: true // Mengambil data Pos terkait
        },
        orderBy: (device, { asc }) => [asc(device.nama)]
    });

    return { devices: allDevices };
};
