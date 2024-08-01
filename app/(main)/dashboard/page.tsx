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

export default function DashboardPage() {
  const { email, name } = useUser();
  const { actions, isLoading, isError } = useActions({
    email,
  });
  const [showTutorial, setShowTutorial] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);

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
    const confettiAlreadyShown = localStorage.getItem("confettiShown");
    if (confettiAlreadyShown !== "true" && actions?.isMeetGoals) {
      setConfettiShown(true);
      localStorage.setItem("confettiShown", "true");
    }
  }, [actions?.isMeetGoals]);

  useEffect(() => {
    const clearLocalStorageIfNewMonth = () => {
      const lastClearedDate = localStorage.getItem("lastClearedDate");

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      let shouldClear = false;

      if (lastClearedDate) {
        const lastCleared = new Date(lastClearedDate);
        const lastClearedMonth = lastCleared.getMonth();
        const lastClearedYear = lastCleared.getFullYear();

        if (
          currentMonth !== lastClearedMonth ||
          currentYear !== lastClearedYear
        ) {
          shouldClear = true;
        }
      } else {
        shouldClear = true;
      }

      if (shouldClear) {
        localStorage.removeItem("confettiShown");

        localStorage.setItem("lastClearedDate", currentDate.toISOString());
      }
    };

    clearLocalStorageIfNewMonth();
  }, []);

  useEffect(() => {
    if (actions?.hasViewedDashboardTutorial === false) {
      pauseFor(2000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [actions?.hasViewedDashboardTutorial]);

  const visbleWidth = getVisibleWidth(useWindowWidth());
  const visibleHeight = useWindowHeight();

  return (
    <main className="relative flex flex-col items-center text-white px-4">
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
      {actions?.isMeetGoals && confettiShown && (
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
