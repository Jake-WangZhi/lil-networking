"use client";

import { ActionList } from "@/components/ActionList";
import { GoalSummary } from "@/components/GoalSummary";
import { useSession } from "next-auth/react";
import { useActions } from "@/hooks/useActions";
import { Typography } from "@mui/material";
import { PlusSquare } from "react-feather";
import { Button } from "@/components/Button";
import { InfoTooltipButton } from "@/components/InfoTooltipButton";
import { NavFooter } from "@/components/NavFooter";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { actions, isLoading, isError } = useActions({
    email: session?.user?.email,
  });

  const handlePlusClick = useCallback(
    () => router.push("/contacts/create"),
    [router]
  );

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
        <div className="flex justify-between items-center">
          <Button onClick={() => router.push("/onboarding")}>Onboarding</Button>
          <Typography variant="h1">
            Hi, {session?.user?.name?.split(" ")[0]}!
          </Typography>
          <div className="flex items-center space-x-2">
            <InfoTooltipButton />
            <Button variant="text" onClick={handlePlusClick} sx={{ px: "8px" }}>
              <PlusSquare
                size={32}
                color={"#38ACE2"}
                className="md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            </Button>
          </div>
        </div>
        <GoalSummary />
      </div>
      <ActionList actions={actions} isLoading={isLoading} isError={isError} />
      <NavFooter />
    </main>
  );
}
