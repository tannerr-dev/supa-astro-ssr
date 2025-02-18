import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { APIContext } from "astro";

export async function GET({request, cookies, url, redirect}: APIContext){
  const supabase = createServerClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  {
    auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, options))
      },
    },
   }
  );

  let token_hash = url.searchParams.get('token_hash');
  let type = url.searchParams.get('type');

  const {data, error } = await supabase.auth.verifyOtp({ token_hash, type })
  console.log(error)

  if(!data){
    return redirect('/signin');
  }
  // this is the section that actually works
  cookies.set('sb-access-token', data.session.access_token, {
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // false in development
    sameSite: 'lax', // less restrictive for development
  });
  cookies.set("sb-refresh-token",data.session.refresh_token,{
    path: '/',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production', // false in development
    sameSite: 'lax', // less restrictive for development
  });
  
  return redirect('/dashboard')
}
