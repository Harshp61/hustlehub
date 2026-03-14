"use client";
import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/supabaseClient";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import Loading from "@/app/(front)/loading";

export default function Posts({
  data,
  user,
  totalPosts,
}: {
  data: Array<PostType> | [];
  user: User;
  totalPosts: number;
}) {
  const supabase = createClient();
  const [posts, setPosts] = useState<Array<PostType>>(data);
  const limit = 5;
  const [page, setPage] = useState(1);
  const [noMoreData, setNoMoreData] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const getPublicUrl = (path: string | null | undefined) => {
    if (!path) return undefined;
    const { data } = supabase.storage.from("hustle").getPublicUrl(path);
    return data.publicUrl;
  };

  useEffect(() => {
    if (inView) {
      fetchMorePosts();
    }
  }, [inView]);

  useEffect(() => {
    const postChannel = supabase.channel("postsChannel");

    postChannel
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          setPosts((prev) => prev.filter((item) => item.post_id !== payload.old?.id));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        async (payload) => {
          const { data: postUser } = await supabase
            .from("users")
            .select("id,name,email,username,profile_image")
            .eq("id", payload.new?.user_id)
            .single();

          const newPost: PostType = {
            post_id: payload.new?.id,
            user_id: payload.new?.user_id,
            content: payload.new?.content,
            image: getPublicUrl(payload.new?.image),
            likes_count: payload.new?.likes_count,
            reply_count: payload.new?.reply_count,
            created_at: payload.new?.created_at,
            email: postUser?.email!,
            liked: false,
            name: postUser?.name,
            username: postUser?.username,
            profile_image: postUser?.profile_image,
          };
          setPosts((prev) => [newPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      postChannel.unsubscribe();
    };
  }, []);

  const fetchMorePosts = async () => {
    let from = page * limit;
    let to = from + limit;
    
    if (from >= totalPosts) {
      setNoMoreData(true);
      return;
    }

    const { data: morePosts, error } = await supabase
      .rpc("get_posts_with_likes", { request_user_id: user.id })
      .order("post_id", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Error fetching more posts", { theme: "colored" });
      return;
    }

    if (morePosts && morePosts.length > 0) {
      const formattedPosts = morePosts.map((post: any) => ({
        ...post,
        image: getPublicUrl(post.image),
      }));
      setPosts((prev) => [...prev, ...formattedPosts]);
      setPage((p) => p + 1);
    } else {
      setNoMoreData(true);
    }
  };

  return (
    <div>
      {posts.map((item) => (
        <PostCard post={item} key={item.post_id} user={user} />
      ))}
      {!noMoreData && (
        <div ref={ref}>
          <Loading />
        </div>
      )}
      {noMoreData && <p className="text-center mt-4">No more posts to fetch!!</p>}
    </div>
  );
}