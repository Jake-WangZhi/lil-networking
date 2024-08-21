"use client";

import { ActionList } from "@/components/dashboard/ActionList";
import { GoalSummary } from "@/components/dashboard/GoalSummary";
import { useActions } from "@/hooks/useActions";
import { Typography } from "@mui/material";
import { InfoTooltipButton } from "@/components/InfoTooltipButton";
import { NavFooter } from "@/components/NavFooter";
import { AddContactTooltipButton } from "@/components/AddContactTooltipButton";
import { useEffect, useState } from "react";
import { event } from "nextjs-google-analytics";
import { useUser } from "@/contexts/UserContext";
import Confetti from "react-confetti";
import { DashboardTutorial } from "@/components/dashboard/DashboardTutorial";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import { getVisibleWidth, handleRefresh, pauseFor } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import PullToRefresh from "react-simple-pull-to-refresh";
import { ClipLoader } from "react-spinners";

export default function DashboardPage() {
  const { email, name } = useUser();
  const { actions, isLoading, isError, refetch, isRefetching } = useActions({
    email,
  });
  const [showTutorial, setShowTutorial] = useState(false);
  const { isDashboardTutorialShown } = useSettings();

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
      pauseFor(3000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [actions?.hasViewedDashboardTutorial]);

  const visbleWidth = getVisibleWidth(useWindowWidth());
  const visibleHeight = useWindowHeight();

  const renderDashboard = () => {
    return (
      <>
        <ActionList
          actions={actions}
          isLoading={isLoading}
          isError={isError}
          isRefetching={isRefetching}
        />
      </>
    );
  };

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-4 pb-3 mb-2 md:pt-8">
        <div className="flex justify-between items-center">
          <Typography variant="h1">Hi, {name?.split(" ")[0]}!</Typography>
          <div className="flex items-center space-x-1 -mr-3">
            <InfoTooltipButton />
            <AddContactTooltipButton
              hasContacts={actions?.hasContacts}
              hasShownTutorial={actions?.hasViewedDashboardTutorial}
            />
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

      {!isLoading ? (
        <PullToRefresh
          onRefresh={handleRefresh(refetch)}
          resistance={3}
          refreshingContent={
            <ClipLoader color="#38ACE2" size={50} className="mt-5" />
          }
        >
          {renderDashboard()}
        </PullToRefresh>
      ) : (
        renderDashboard()
      )}

      <NavFooter />
      {showTutorial && isDashboardTutorialShown && <DashboardTutorial />}
    </main>
  );
}
