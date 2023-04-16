import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import AuthedMenu from "./authed-menu";
import UnauthedMenu from "./unauthed-menu";

export default async function Menu() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const { data } = await supabase.auth.getSession();

  if (data.session) return <AuthedMenu />;

  return <UnauthedMenu />;
}
