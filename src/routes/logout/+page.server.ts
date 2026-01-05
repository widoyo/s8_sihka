import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ locals, cookies }) => {
        // 1. Cek apakah ada session aktif
        if (!locals.session) {
            return fail(401);
        }

        // 2. Hapus session dari database (via Lucia)
        await lucia.invalidateSession(locals.session.id);

        // 3. Buat cookie kosong untuk menghapus cookie di browser
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        // 4. Lempar user kembali ke halaman login
        throw redirect(302, "/login");
    }
};