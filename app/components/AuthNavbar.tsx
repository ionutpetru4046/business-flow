
import { createSupabaseServerClient } from "../../lib/supabase-server";
import Navbar from "../../components/Navbar";

export default async function AuthNavbar() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return <Navbar isAuthenticated={!error && !!user} />;
}
