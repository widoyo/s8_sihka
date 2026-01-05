import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const allUsers = await db.query.user.findMany({
        with: {
            pos: true // Mengambil data Pos terkait
        },
        orderBy: (user, { asc }) => [asc(user.username)]
    });

    return { users: allUsers };
};

export const actions = {
    // Action untuk ganti status Aktif/Non-aktif
    toggleStatus: async ({ request }) => {
        console.log("Toggling user status");
        const formData = await request.formData();
        const idValue = formData.get('id');
        if (!idValue) {
            return { success: false, error: 'missing id' };
        }
        const id = String(idValue);
        const currentStatus = formData.get('status') === 'true';

        await db.update(user)
            .set({ isActive: !currentStatus }) // Asumsi ada kolom isActive
            .where(eq(user.id, id));
            
        return { success: true };
    },

    setPassword: async ({ request }) => {
        console.log("Setting user password");
        const formData = await request.formData();
        const idValue = formData.get('id');
        const newPasswordValue = formData.get('newPassword');
        if (!idValue || !newPasswordValue) {
            return { success: false, error: 'missing id or newPassword' };
        }
        const id = String(idValue);
        const newPassword = String(newPasswordValue);

        // Dalam realita, gunakan hashing password di sini
        await db.update(user)
            .set({ passwordHash: newPassword }) // Asumsi ada kolom passwordHash
            .where(eq(user.id, id));
            
        return { success: true };
    }
};