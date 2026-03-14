import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  name,
  image,
  width = 3,
  height = 3,
}: {
  name: string;
  image?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Avatar style={{ width: `${width}rem`, height: `${height}rem` }}>
      {image && (
        <AvatarImage
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
        />
      )}
      <AvatarFallback className="text-2xl font-bold">
        {name?.trim()?.charAt(0) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}