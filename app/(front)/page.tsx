import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session?.user) {
    redirect("/login");
  }

  return <div>{JSON.stringify(data.session.user)}</div>;
}