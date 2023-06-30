"use client";

import { Button } from "@/components/Button";
import { NavFooter } from "@/components/NavFooter";
import { Typography } from "@mui/material";
import { UserCircle } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ChevronRight } from "react-feather";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoalsClick = useCallback(() => {
    router.push("/settings/goals");
  }, [router]);

  const handleNotificationsClick = useCallback(() => {
    router.push("/settings/notifications");
  }, [router]);

  return (
    <main className="relative min-h-screen py-8 space-y-6">
      <Typography variant="h1" sx={{ px: "24px" }}>
        Settings
      </Typography>
      <div className="flex items-center px-4 space-x-2">
        <div className="w-10 h-10 bg-white bg-opacity-[0.12] rounded-full flex justify-center items-center md:w-11 md:h-11 lg:w-12 lg:h-12">
          <UserCircle
            color="white"
            size={24}
            className="md:w-7 md:h-7 lg:w-8 lg:h-8"
          />
        </div>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {session?.user?.name}
        </Typography>
      </div>
      <div>
        <Button
          variant="text"
          sx={{ width: "100%" }}
          onClick={handleGoalsClick}
        >
          <div className="flex justify-between px-4 w-full">
            <Typography variant="subtitle1">Goals</Typography>
            <ChevronRight size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </div>
        </Button>
        <Button
          variant="text"
          sx={{
            width: "100%",
          }}
          onClick={handleNotificationsClick}
        >
          <div className="flex justify-between px-4 w-full">
            <Typography variant="subtitle1">Notifications</Typography>
            <ChevronRight size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </div>
        </Button>
      </div>
      <NavFooter />
    </main>
  );
}
