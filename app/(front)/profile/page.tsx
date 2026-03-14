import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import UserAvatar from "@/components/common/UserAvatar";
import ProfileUpdate from "@/components/user/ProfileUpdate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/post/PostCard";
import CommentCard from "@/components/comments/CommentCard";

// Ensure your PostType is imported correctly
// import { PostType } from "@/types"; 

export default async function Profile() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  // Helper to safely generate public URL
  const getPublicUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;
    const { data } = supabase.storage.from("hustle").getPublicUrl(path);
    return data.publicUrl;
  };

  const metadata = user.user_metadata as {
    name?: string;
    username?: string;
    description?: string;
    profile_image?: string;
  };

  // Fetch Posts — do NOT pre-transform image; ImageViewModal calls getS3Url itself
  const { data: rawPosts } = await supabase
    .rpc("get_posts_with_likes", { request_user_id: user.id })
    .order("post_id", { ascending: false })
    .eq("user_id", user.id);

  const posts: PostType[] = (rawPosts || []) as PostType[];

  // Fetch Comments
  const { data: comments } = await supabase
    .from("comments")
    .select("id,image,content,created_at,users(id,name,username,profile_image)")
    .eq("user_id", user.id);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{metadata?.name}</p>
          <p className="font-bold text-gray-500">@{metadata?.username}</p>
        </div>

        <UserAvatar
          name={metadata?.name ?? "User"}
          image={getPublicUrl(metadata?.profile_image)}
          width={5}
          height={5}
        />
      </div>

      <p className="mt-4 text-gray-700">{metadata?.description}</p>

      <div className="mt-4">
        <ProfileUpdate user={user} />
      </div>

      <Tabs defaultValue="posts" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {posts.map((item) => (
            <PostCard post={item} key={item.post_id} user={user} />
          ))}
        </TabsContent>

        <TabsContent value="comments">
          {(comments ?? []).map((item, index) => (
            <CommentCard comment={item} key={item.id ?? index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}