// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Kirim data user dan session ke semua halaman & komponen
    return {
        user: locals.user,
        session: locals.session
    };
};