"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ImagePreview from "../common/ImagePreview";
import { createClient } from "@/lib/supabase/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProfileUpdate({ user }: { user?: User | null }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const [authState, setAuthState] = useState({
    name: user?.user_metadata?.["name"] ?? "",
    username: user?.user_metadata?.["username"] ?? "",
    description: user?.user_metadata?.["description"] ?? "",
    email: user?.email ?? "",
  });

  const supabase = createClient();
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImage(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const removePreview = () => {
    setImage(null);
    if (imageRef.current) imageRef.current.value = "";
    setPreviewUrl(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!user) {
      toast.error("User not found. Please login again.");
      setLoading(false);
      return;
    }

    let payload: any = {
      name: authState.name,
      description: authState.description,
    };

    try {
      if (image) {
        const path = `${user.id}/profile.png`;

        const { error } = await supabase.storage
          .from("hustle")
          .upload(path, image, {
            upsert: true,
            contentType: image.type,
          });

        if (error) {
          console.error(error);
          toast.error(error.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from("hustle").getPublicUrl(path);

        payload.profile_image = data.publicUrl;
      }

      const { error } = await supabase.auth.updateUser({
        data: payload,
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="overflow-y-scroll max-h-screen"
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={authState.name}
              onChange={(event) =>
                setAuthState({ ...authState, name: event.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <Label>Email</Label>
            <Input type="email" value={authState.email} readOnly />
          </div>

          <div className="mb-4">
            <Label>Bio</Label>
            <Textarea
              value={authState.description}
              placeholder="Type your bio"
              onChange={(event) =>
                setAuthState({
                  ...authState,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="mb-4">
            <Label>Profile Image</Label>
            <Input type="file" ref={imageRef} onChange={handleImageChange} />

            {previewUrl && (
              <div className="mt-2">
                <ImagePreview image={previewUrl} callback={removePreview} />
              </div>
            )}
          </div>

          <div className="mb-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}