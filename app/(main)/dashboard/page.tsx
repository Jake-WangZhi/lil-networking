"use client";

import { ActionList } from "@/components/ActionList";
import { GoalSummary } from "@/components/GoalSummary";
import { useActions } from "@/hooks/useActions";
import { Typography } from "@mui/material";
import { InfoTooltipButton } from "@/components/InfoTooltipButton";
import { NavFooter } from "@/components/NavFooter";
import { AddContactTooltipButton } from "@/components/AddContactTooltipButton";
import { useEffect, useState } from "react";
import { event } from "nextjs-google-analytics";
import { useUser } from "@/contexts/UserContext";
import Confetti from "react-confetti";
import { DashboardTutorial } from "@/components/DashboardTutorial";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import { getVisibleWidth, pauseFor } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

export default function DashboardPage() {
  const { email, name } = useUser();
  const { actions, isLoading, isError } = useActions({ email });
  const [showTutorial, setShowTutorial] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("serviceworker.js");
    }
  }, []);

  useEffect(() => {
    const eventAlreadySent = sessionStorage.getItem("lastOpenedEventSent");

    if (!eventAlreadySent && email) {
      event(`last_opened`, {
        category: new Date().toISOString(),
        label: email,
      });

      sessionStorage.setItem("lastOpenedEventSent", "true");
    }
  }, [email]);

  useEffect(() => {
    if (actions?.hasViewedDashboardTutorial === false) {
      pauseFor(2000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [actions?.hasViewedDashboardTutorial]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const startY = e.touches[0].clientY;
        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length > 0) {
            const currentY = e.touches[0].clientY;
            if (currentY > startY + 50) {
              setIsRefreshing(true);
              refreshPage();
            }
          }
        };

        const handleTouchEnd = () => {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };

        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const refreshPage = () => {
    console.log("Page refreshed!");
    setIsRefreshing(false);
  };

  const visbleWidth = getVisibleWidth(useWindowWidth());
  const visibleHeight = useWindowHeight();

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 bg-white text-black p-2 text-center">
          <ClipLoader color="#38ACE2" size={50} />
        </div>
      )}
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
        <div className="flex justify-between items-center">
          <Typography variant="h1">Hi, {name?.split(" ")[0]}!</Typography>
          <div className="flex items-center space-x-2">
            <InfoTooltipButton />
            <AddContactTooltipButton hasContacts={actions?.hasContacts} />
          </div>
        </div>
        <GoalSummary isMeetGoals={actions?.isMeetGoals} />
      </div>
      {actions?.showConfetti && (
        <Confetti
          width={visbleWidth}
          height={visibleHeight}
          style={{ zIndex: "20" }}
          recycle={false}
        />
      )}
      <ActionList actions={actions} isLoading={isLoading} isError={isError} />
      <NavFooter />
      {showTutorial && <DashboardTutorial />}
    </main>
  );
}
