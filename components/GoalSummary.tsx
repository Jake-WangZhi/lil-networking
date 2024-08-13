import { Typography } from "@mui/material";
import { GoalStats } from "./GoalStats";
import { useGoals } from "@/hooks/useGoals";
import { Button } from "./Button";
import { PlusCircle } from "react-feather";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useCallback, useEffect } from "react";
import { event } from "nextjs-google-analytics";
import { useUser } from "@/contexts/UserContext";
import { Lightning, Confetti } from "@phosphor-icons/react";

interface Props {
  isMeetGoals?: boolean;
}

export const GoalSummary = ({ isMeetGoals }: Props) => {
  const router = useRouter();
  const { email } = useUser();

  const { goals, isLoading, isError } = useGoals({
    email,
  });

  useEffect(() => {
    const eventAlreadySent = sessionStorage.getItem("streakEventSent");

    if (!eventAlreadySent && !isLoading && email) {
      event(`current_streak`, {
        category: new Date().toISOString(),
        label: email,
        value: goals ? goals.streak : 0,
      });

      event(`highest_streak`, {
        label: email,
        value: goals ? goals.streak : 0,
      });

      sessionStorage.setItem("streakEventSent", "true");
    }
  }, [isLoading, goals, email]);

  const handleClick = useCallback(() => router.push("/goals"), [router]);

  if (isError) {
    return (
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FB5913",
          marginTop: "24px",
          marginBottom: "4px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.05) !important",
          borderRadius: "12px",
          height: "140px",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-6 mb-1 w-full bg-white bg-opacity-5 rounded-xl h-[140px]">
        <ClipLoader color="#38ACE2" size={50} />
      </div>
    );
  }

  return (
    <div className="mt-6 mb-1">
      {goals ? (
        <div className="w-full bg-white bg-opacity-5 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {new Date().toLocaleString("default", { month: "long" })} Goals
            </Typography>
            <div className="flex items-center gap-2">
              <Lightning className="text-primary-yellow text-2xl md:text-3xl lg:text-4xl" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {goals.streak} month streak
              </Typography>
            </div>
          </div>
          <GoalStats goals={goals} />
          {isMeetGoals && (
            <div className="flex items-center justify-center gap-2">
              <Confetti className="text-primary-yellow text-2xl md:text-3xl lg:text-4xl" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                You met your monthly goals!
              </Typography>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="text"
          onClick={handleClick}
          sx={{
            width: "100%",
            gap: "4px",
            border: "1px dashed rgba(255, 255, 255, 0.7)",
            borderRadius: "12px",
            height: "140px",
            backgroundColor: "rgba(255, 255, 255, 0.05) !important",
            "&:hover": {
              border: "1px dashed rgba(255, 255, 255, 0.7)",
              borderRadius: "12px",
            },
          }}
        >
          <PlusCircle />
          Add Goal
        </Button>
      )}
    </div>
  );
};
