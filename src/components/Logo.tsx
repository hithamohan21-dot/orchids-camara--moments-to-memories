"use client";

import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "", showTagline = false }: { className?: string; showTagline?: boolean }) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center gap-2">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c44e58e5-b73d-46c4-8c54-3d20d5288039/ColorLogo-1767634934579.png?width=8000&height=8000&resize=contain"
                alt="CAMARA Logo"
                width={100}
                height={40}
                className="h-5 md:h-7 w-auto object-contain"
              />
        </div>
      </div>
    );
}
