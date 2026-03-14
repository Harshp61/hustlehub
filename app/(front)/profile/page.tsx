import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import UserAvatar from "@/components/common/UserAvatar";
import ProfileUpdate from "@/components/user/ProfileUpdate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/post/PostCard";
import CommentCard from "@/components/comments/CommentCard";

export default async function Profile() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  const metadata = user?.user_metadata as {
    name?: string;
    username?: string;
    description?: string;
    profile_image?: string;
  };

  const { data: posts } = await supabase
    .rpc("get_posts_with_likes", {
      request_user_id: user?.id,
    })
    .order("post_id", { ascending: false })
    .eq("user_id", user?.id);

  const { data: comments } = await supabase
    .from("comments")
    .select(
      "id,image,content,created_at,users(id,name,username,profile_image)"
    )
    .eq("user_id", user?.id);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{metadata?.name}</p>
          <p className="font-bold">@{metadata?.username}</p>
        </div>

        <UserAvatar
          name={metadata?.name ?? "User"}
          image={metadata?.profile_image ?? ""}
          width={5}
          height={5}
        />
      </div>

      <p className="mt-4">{metadata?.description}</p>

      <ProfileUpdate user={user!} />

      <Tabs defaultValue="posts" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {posts?.map((item: PostType, index: number) => (
            <PostCard
              post={item as PostType}
              key={index}
              user={data.session?.user!}
            />
          ))}
        </TabsContent>

        <TabsContent value="comments">
          {comments?.map((item, index) => (
            <CommentCard comment={item} key={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}