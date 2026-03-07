"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <Image
        src="/error.jpg"
        width={200}
        height={200}
        alt="Error"
        className="w-"
      />
      <Link href="/">
        <br/>
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}