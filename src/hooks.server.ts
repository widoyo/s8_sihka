// src/hooks.server.ts
import { lucia } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	console.log('Handling request for:', event.url.pathname);
    const sessionId = event.cookies.get(lucia.sessionCookieName);
	console.log('Session ID from cookie:', sessionId);

	// 1. Validasi Session lewat Lucia
    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
    } else {
        const { session, user } = await lucia.validateSession(sessionId);
        event.locals.user = user;
        event.locals.session = session;
		console.log('Validated session for user ID:', user?.id);
    }

    // 2. Proteksi Halaman (Contoh: semua kecuali /login)
    if (!event.locals.session && !event.url.pathname.startsWith('/login')) {
		const loginUrl = `/login?next=${encodeURIComponent(event.url.pathname)}`;
        throw redirect(302, loginUrl);
    }


    return resolve(event);
};