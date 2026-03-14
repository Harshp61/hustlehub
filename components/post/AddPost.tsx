"use client";
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image, StickyNote } from "lucide-react";
import { Button } from "../ui/button";
import ImagePreview from "../common/ImagePreview";
import { createClient } from "@/lib/supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { User } from "@supabase/supabase-js";
import { toast } from "react-toastify";

export default function AddPost({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleIconClick = () => {
    imageRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
    }
  };

  const removePriview = () => {
    setImage(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setPreviewUrl(undefined);
  };

  const addPost = async () => {
    if (!user) {
      toast.error("You must be logged in to post.", { theme: "colored" });
      return;
    }

    setLoading(true);
    const payload: any = {
      content: content,
      user_id: user.id,
    };

    if (image) {
      const path = `${user.id}/${uuidv4()}`;
      const { data: imgData, error } = await supabase.storage
        .from("hustle")
        .upload(path, image);

      if (error) {
        toast.error("Image upload failed. Please try again!", {
          theme: "colored",
        });
        setLoading(false);
        return;
      }
      payload.image = imgData.path;
    }

    const { error: postErr } = await supabase.from("posts").insert(payload);
    
    if (postErr) {
      toast.error("Could not save post. Please try again!", {
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    resetState();
    setLoading(false);
    toast.success("Post added successfully!", { theme: "colored" });
    setOpen(false);
  };

  const resetState = () => {
    setContent("");
    removePriview();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="border-none"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Post</DialogTitle>
        </DialogHeader>
        <div>
          <textarea
            className="bg-muted rounded-lg w-full outline-none border h-32 p-2"
            placeholder="Add your thought..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
          {previewUrl && (
            <ImagePreview image={previewUrl} callback={removePriview} />
          )}
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
            accept="image/png,image/jpg,image/jpeg,image/svg,image/gif"
            aria-label="Upload image"
          />
          <div className="flex justify-between items-center mt-2">
            <Image
              className="h-5 w-5 text-gray-500 mt-2 cursor-pointer"
              onClick={handleIconClick}
            />
            <Button size="sm" disabled={content.length <= 0 || loading} onClick={addPost}>
              {loading ? "Processing.." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}