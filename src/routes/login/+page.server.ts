// src/routes/login/+page.server.ts
import { lucia } from "$lib/server/auth";
import { verify } from "@node-rs/argon2";

import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async (url) => {
    const next = url.url.searchParams.get("next") || "/";
    return { next };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get("username") as string;
        const password = formData.get("password") as string; // Dalam realita, gunakan library hashing!

        const next = formData.get("next") as string || "/";
        const safeNext = next.startsWith('/') ? next : '/';

        // 1. Cari user di DB lewat Drizzle
        const [existingUser] = await db.select().from(user).where(eq(user.username, username));

        if (!existingUser) {
            return fail(400, { message: "Username atau password salah" });
        }

        const isPasswordValid = await verify(existingUser.passwordHash, password);

        if (!isPasswordValid) {
            return fail(400, { message: "Username atau password salah" });
        }

        // 2. Buat Session Lucia
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: "/",
            ...sessionCookie.attributes
        });

        // 3. Redirect ke dashboard/home
        throw redirect(302, safeNext);
    }
};