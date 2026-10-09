import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs only for /admin and /login. It refreshes the Supabase session cookie and sends
 * signed-out visitors from /admin to /login. Role checks happen again on the server in
 * the admin layout and in every admin action; this is only the first gate.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const toLogin = () => {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    if (isAdminPath) login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  };

  if (!url || !anonKey) return isAdminPath ? toLogin() : NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath && !user) {
    const redirect = toLogin();
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*", "/login"] };
