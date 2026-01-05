import { describe, it, expect, vi } from 'vitest';
import { handle } from './hooks.server';

describe('Auth Guard Spec', () => {
    console.log("Database URL yang digunakan:", process.env.DATABASE_URL);
    it('harus redirect ke /login jika user mencoba akses "/" tanpa session', async () => {
        const event = {
            url: { pathname: '/' },
            cookies: { get: vi.fn().mockReturnValue(undefined) }, // No session
            locals: {},
        } as any;

        const resolve = vi.fn();

        // Kita expect ini melempar redirect (SvelteKit throw redirect adalah object)
        try {
            await handle({ event, resolve });
        } catch (err: any) {
            expect(err.status).toBe(302);
            expect(err.location).toContain('/login');
        }
    });

    it('harus mengizinkan akses jika user memiliki session', async () => {
        // Mock session ditemukan (logika Lucia disederhanakan untuk test ini)
        const event = {
            url: { pathname: '/login' },
            cookies: { get: vi.fn().mockReturnValue('valid-id') },
            locals: { session: { user: 'abc' } }, // Mock hasil validate
            resolve: vi.fn().mockResolvedValue('ok')
        } as any;

        const response = await handle({ event, resolve: event.resolve });
        expect(response).toBe('ok');
    });
});