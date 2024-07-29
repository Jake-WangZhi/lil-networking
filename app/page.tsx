"use client";

import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Heart } from "@phosphor-icons/react";
import logo from "@/public/icons/logo.png";
import Image from "next/image";

// Prisma does not support Edge without the Data Proxy currently
export const runtime = "nodejs"; // default
export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <main className="relative flex flex-col items-center h-screen justify-center">
      <div className="flex flex-col items-center">
        <Image src={logo} alt="Logo" width={186} height={186} />
        <Typography variant="h2">Lil&apos; Networking App</Typography>
      </div>
      <div className="my-4">
        <ClipLoader color="#38ACE2" size={50} />
      </div>
      <div className="absolute bottom-0 mb-20 flex items-center gap-2">
        <Typography variant="subtitle1">Made with</Typography>
        <Heart color="red" size={24} weight="fill" />
      </div>
    </main>
  );
}
