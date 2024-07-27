"use client";

import { AddToHomeScreenBanner } from "@/components/AddToHomeScreenBanner";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <main className="relative flex flex-col justify-center px-8 space-y-4 mt-20">
      <h1 className="flex flex-col text-light-blue text-start text-5xl font-bold tracking-tight leading-72 md:text-7xl">
        <span className="text-3xl md:text-5xl leading-48">Lil</span>
        <span className="text-white">Networking</span>
        App
      </h1>
      <div className="w-1/12 h-[202px] border-l-4 border-light-blue"></div>
      <Typography variant="h3">
        Build networking habits & <br />
        reach your goals
      </Typography>
      <AddToHomeScreenBanner addBottomPadding={false} />
    </main>
  );
}
