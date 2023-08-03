"use client";

import { ActionList } from "~/components/ActionList";
import { GoalSummary } from "~/components/GoalSummary";
import { useSession } from "next-auth/react";
import { useActions } from "~/hooks/useActions";
import { Typography } from "@mui/material";
import { InfoTooltipButton } from "~/components/InfoTooltipButton";
import { NavFooter } from "~/components/NavFooter";
import { AddContactTooltipButton } from "~/components/AddContactTooltipButton";
import { useEffect } from "react";
import { event } from "nextjs-google-analytics";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { actions, isLoading, isError } = useActions({
    email: session?.user?.email,
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("serviceworker.js");
    }
  }, []);

  useEffect(() => {
    const eventAlreadySent = sessionStorage.getItem("lastOpenedEventSent");

    const email = session?.user?.email;
    if (!eventAlreadySent && email) {
      event(`last_opened`, {
        category: new Date().toISOString(),
        label: email,
      });

      sessionStorage.setItem("lastOpenedEventSent", "true");
    }
  }, [session?.user?.email]);

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
        <div className="flex justify-between items-center">
          <Typography variant="h1">
            Hi, {session?.user?.name?.split(" ")[0]}!
          </Typography>
          <div className="flex items-center space-x-2">
            <InfoTooltipButton />
            <AddContactTooltipButton hasContacts={actions?.hasContacts} />
          </div>
        </div>
        <GoalSummary />
      </div>
      <ActionList actions={actions} isLoading={isLoading} isError={isError} />
      <NavFooter />
    </main>
  );
}
