"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGoalsMutation } from "@/hooks/useGoalsMutation";
import { useRouter } from "next/navigation";
import { Grid, Typography } from "@mui/material";
import { Button } from "@/components/Button";
import { ChevronLeft } from "react-feather";
import { ClipLoader } from "react-spinners";
import { useGoals } from "@/hooks/useGoals";
import { SearchParams } from "@/types";
import Lottie from "react-lottie";
import animationData from "../../../../lottie/106770-empty-box.json";
import { useUser } from "@/contexts/UserContext";

export default function GoalSettingPage() {
  const router = useRouter();
  const { email } = useUser();
  const { goals, isLoading, isError } = useGoals({
    email,
  });

  const [goalConnections, setGoalConnections] = useState(2);
  const [goalMessages, setGoalMessages] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    //Use setTimeout to create a short delay to prevent accidental button triggering
    //when redirected from the onboarding
    setTimeout(() => {
      setIsDisabled(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (goals) {
      const { goalConnections, goalMessages } = goals;

      setGoalConnections(goalConnections);
      setGoalMessages(goalMessages);
    }
  }, [goals]);

  const putGoalsMutation = useGoalsMutation({
    method: "PUT",
    onSuccess: () => {
      setErrorMessage("");
      router.push("/settings");
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
    },
  });

  const GOAL_QUESTIONS = useMemo(
    () => [
      {
        title: "How many new contacts do you want to make per month?",
        setValue: setGoalConnections,
        selectedValue: goalConnections,
        buttonContents: [
          {
            label: "2",
            value: 2,
          },
          {
            label: "5",
            value: 5,
          },
          {
            label: "10",
            value: 10,
          },
        ],
      },
      {
        title: "How many contacts do you want to reach out to per month?",
        setValue: setGoalMessages,
        selectedValue: goalMessages,
        buttonContents: [
          {
            label: "2",
            value: 2,
          },
          {
            label: "5",
            value: 5,
          },
          {
            label: "10",
            value: 10,
          },
        ],
      },
    ],
    [goalConnections, goalMessages]
  );

  const handleBackClick = useCallback(() => {
    router.push("/settings");

    putGoalsMutation.mutate({
      goalsArgs: {
        goalConnections,
        goalMessages,
      },
      email: email || "",
    });
  }, [router, goalConnections, goalMessages, putGoalsMutation, email]);

  const handleSetGoalsClick = useCallback(() => {
    router.push(`/goals?${SearchParams.IsFromSettings}=true`);
  }, [router]);

  const handleOptionClick = useCallback(
    (value: number, setValue: Dispatch<SetStateAction<number>>) => () =>
      setValue(value),
    []
  );

  if (isError) {
    return (
      <Typography
        variant="h3"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#F42010",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (!goals) {
    return (
      <div className="relative py-8">
        <Grid container alignItems="center" sx={{ px: "16px" }}>
          <Grid item xs={2}>
            <Button
              variant="text"
              onClick={handleBackClick}
              sx={{ px: "6px", ml: "-6px" }}
            >
              <ChevronLeft
                size={36}
                className="md:w-11 md:h-11 lg:w-13 lg:h-13"
              />
            </Button>
          </Grid>
          <Grid item xs={8} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Goals
            </Typography>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <div className="h-[80vh] flex flex-col justify-center items-center space-y-6 px-7">
          <Lottie
            options={{
              loop: 1,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            width={178}
            height={178}
          />
          <div className="space-y-4 text-center">
            <Typography variant="h2">No Goals</Typography>
            <Typography variant="subtitle1">
              Set up your goals to build habits and track your growth as a
              networker
            </Typography>
          </div>
          <div className="text-center">
            <Button variant="contained" onClick={handleSetGoalsClick}>
              Set up goals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen py-8 space-y-6">
      <Grid container alignItems="center" sx={{ px: "16px" }}>
        <Grid item xs={2}>
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ px: "6px", ml: "-6px" }}
          >
            <ChevronLeft
              size={36}
              className="md:w-11 md:h-11 lg:w-13 lg:h-13"
            />
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Goals
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      {errorMessage && (
        <Typography variant="subtitle2">{errorMessage}</Typography>
      )}
      <div className="px-12 space-y-8">
        {GOAL_QUESTIONS.map(
          ({ title, selectedValue, setValue, buttonContents }, index) => {
            return (
              <div key={`question-${index}`} className="space-y-6">
                <div>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  {buttonContents.map(({ label, value }, index) => {
                    return (
                      <Button
                        key={`answer-${index}`}
                        variant="outlined"
                        sx={{
                          px: "38px",
                          py: "12px",
                          border:
                            selectedValue === value
                              ? "1px solid #38ACE2"
                              : "none",
                          color: selectedValue === value ? "#38ACE2" : "white",
                        }}
                        onClick={handleOptionClick(value, setValue)}
                        disabled={isDisabled}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>
    </main>
  );
}
