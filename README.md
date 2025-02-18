# Supabase SSR + Astro SSR

This is my minimal config for getting Astro and Supabase working.

The supabase docs didn't have a *super* straight forward example for this.
I thought I would share mine.

The `src/api/auth/confirm.ts` endpoint is for the magic link emails. (this was the hard part for me)


I'm still experimenting with this.
Some things I'm not sure are required include:
1. `detectSessionInUrl: true,`
2. `secure: process.env.NODE_ENV === 'production', // false in development`
3. `sameSite: 'lax', // less restrictive for development`
