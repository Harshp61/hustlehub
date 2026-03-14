"use client";
import React from "react";
import UserAvatar from "../common/UserAvatar";
import { Bookmark, MoreVertical, Send } from "lucide-react";
import { formatDate, getS3Url } from "@/lib/helper";
import AddComment from "../comments/AddComment";
import { User } from "@supabase/supabase-js";
import PostLike from "./PostLike";
import ImageViewModal from "../common/ImageViewModal";
import Link from "next/link";
import PostMoreOption from "./PostMoreOption";

export default function PostCard({
  post,
  user,
}: {
  post: PostType;
  user: User | UserType;
}) {
  // Guard clause to ensure the component doesn't crash if user data is missing
  if (!user) return null;

  return (
    <div className="w-full bg-muted rounded-2xl mb-4 p-2">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2 items-center">
          <UserAvatar
            name={post.name}
            // Ensure we safely handle empty strings or null paths
            image={post.profile_image ? getS3Url(post.profile_image) : undefined}
          />
          <div className="flex flex-col">
            <p className="font-bold text-sm">{post.name}</p>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <PostMoreOption userId={user.id} post={post} />
      </div>

      {/* Post Image: Passed as a full public URL */}
      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <ImageViewModal image={post.image} />
        </div>
      )}

      {/* Post Content */}
      <Link href={`/post/${post.post_id}`} className="block mb-4 text-md">
        {post.content}
      </Link>

      {/* Interaction Bar */}
      <div className="flex justify-between items-center border-t pt-3 cursor-pointer">
        <div className="flex space-x-6">
          <PostLike userId={user.id} post={post} />
          <AddComment post={post} userId={user.id} />
          <Send className="w-5 h-5 text-gray-600" />
        </div>
        <Bookmark className="w-5 h-5 text-gray-600" />
      </div>

      {/* Counts */}
      <div className="flex space-x-4 text-sm text-gray-500 mt-2">
        <p>{post.reply_count || 0} Replies</p>
        <p>{post.likes_count ?? 0} Likes</p>
      </div> 
    </div>
  );
}