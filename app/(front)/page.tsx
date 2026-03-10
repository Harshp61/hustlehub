import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";
import Posts from "@/components/post/Posts";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const {
    data: posts,
    count,
    error,
  } = await supabase
    .rpc(
      "get_posts_with_likes",
      {
        request_user_id: data.session?.user?.id,
      },
      { count: "exact" }
    )
    .order("post_id", { ascending: false })
    .range(0, 4);

  return (
    <div>
      {posts && posts.length > 0 && (
        <Posts
          user={data.session?.user!}
          data={posts}
          totalPosts={count ?? 0}
        />
      )}
    </div>
  );
}