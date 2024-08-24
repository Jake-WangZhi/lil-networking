"use client";

import { Button } from "@/components/Button";
import { NavFooter } from "@/components/NavFooter";
import { Avatar, Typography } from "@mui/material";
import { UserCircle, CaretRight, SignOut, Heart } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const router = useRouter();

  const handleGoalsClick = useCallback(() => {
    router.push("/settings/goals");
  }, [router]);

  const handleNotificationsClick = useCallback(() => {
    router.push("/settings/notifications");
  }, [router]);

  const handleTutorialsClick = useCallback(() => {
    router.push("/settings/tutorials");
  }, [router]);

  const { name, image } = useUser();

  const handleLogoutClick = useCallback(() => signOut(), []);

  return (
    <main className="relative min-h-screen pb-8 flex flex-col justify-between md:pt-4">
      <div className="space-y-6">
        <Typography variant="h1" sx={{ px: "16px" }}>
          Settings
        </Typography>
        <div className="flex items-center px-4 space-x-2">
          <div className="w-10 h-10 bg-white bg-opacity-[0.12] rounded-full flex justify-center items-center md:w-11 md:h-11 lg:w-12 lg:h-12">
            {image ? (
              <Avatar alt="Remy Sharp" src={image} />
            ) : (
              <UserCircle
                color="white"
                size={24}
                className="md:w-7 md:h-7 lg:w-8 lg:h-8"
              />
            )}
          </div>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
        </div>
        <div className="space-y-4">
          <Button
            variant="text"
            sx={{ width: "100%" }}
            onClick={handleGoalsClick}
          >
            <div className="flex justify-between px-4 w-full">
              <Typography variant="subtitle1">Goals</Typography>
              <CaretRight size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
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
              <CaretRight size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
            </div>
          </Button>
          <Button
            variant="text"
            sx={{
              width: "100%",
            }}
            onClick={handleTutorialsClick}
          >
            <div className="flex justify-between px-4 w-full">
              <Typography variant="subtitle1">Tutorials</Typography>
              <CaretRight size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
            </div>
          </Button>
          <Button
            variant="text"
            sx={{
              width: "100%",
            }}
            onClick={handleLogoutClick}
          >
            <div className="flex justify-between px-4 w-full">
              <Typography variant="subtitle1" sx={{ color: "#38ACE2" }}>
                Logout
              </Typography>
              <SignOut
                size={24}
                className="text-light-blue md:w-7 md:h-7 lg:w-8 lg:h-8"
              />
            </div>
          </Button>
        </div>
      </div>
      <div className="mb-16 flex flex-col items-center gap-2 justify-center">
        {/* <Typography variant="body1" sx={{ opacity: 0.7 }}>
          Powered by Jake Wang
        </Typography> */}
        <div className="flex items-center gap-2">
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            Made with
          </Typography>
          <Heart
            color="red"
            size={16}
            weight="fill"
            className="mb-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
          />
        </div>
      </div>
      <NavFooter />
    </main>
  );
}
