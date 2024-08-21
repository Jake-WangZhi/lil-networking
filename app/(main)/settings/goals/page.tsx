"use client";

import "./styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGoalsMutation } from "@/hooks/useGoalsMutation";
import { useRouter } from "next/navigation";
import { Grid, Typography } from "@mui/material";
import { Button } from "@/components/Button";
import { ClipLoader } from "react-spinners";
import { useGoals } from "@/hooks/useGoals";
import { SearchParams } from "@/types";
import { CaretLeft } from "@phosphor-icons/react";
import { useUser } from "@/contexts/UserContext";

import Lottie from "react-lottie";
import animationData from "@/lottie/106770-empty-box.json";

export default function GoalSettingPage() {
  const router = useRouter();
  const { email } = useUser();
  const { goals, isLoading, isError, isFetching } = useGoals({
    email,
  });

  const [goalConnections, setGoalConnections] = useState(
    goals?.goalConnections
  );
  const [goalMessages, setGoalMessages] = useState(goals?.goalMessages);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isConnectionInput, setIsConnectionInput] = useState(false);
  const [isMessageInput, setIsMessageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const connectionInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isConnectionInput && connectionInputRef.current) {
      connectionInputRef.current.focus();
      connectionInputRef.current.value = "";
    }
  }, [isConnectionInput]);

  useEffect(() => {
    if (isMessageInput && messageInputRef.current) {
      messageInputRef.current.focus();
      messageInputRef.current.value = "";
    }
  }, [isMessageInput]);

  useEffect(() => {
    if (goals) {
      setGoalConnections(goals.goalConnections);
      setGoalMessages(goals.goalMessages);
    }
  }, [goals]);

  useEffect(() => {
    //Use setTimeout to create a short delay to prevent accidental button triggering
    //when redirected from the onboarding
    setTimeout(() => {
      setIsDisabled(false);
    }, 0);
  }, []);

  const putGoalsMutation = useGoalsMutation({
    method: "PUT",
    onSuccess: () => {
      setErrorMessage("");
      router.push("/settings");
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
      setIsSubmitting(false);
    },
  });

  const handleBackClick = useCallback(() => {
    router.push("/settings");
  }, [router]);

  const handleDoneClick = () => {
    if (
      (!goalConnections && goalConnections !== 0) ||
      (!goalMessages && goalMessages !== 0)
    ) {
      setErrorMessage("Please enter positive values for goals");
    } else {
      if (goalConnections < 0 || goalMessages < 0) {
        setErrorMessage("Please enter positive values for goals");
      } else {
        setIsSubmitting(true);

        putGoalsMutation.mutate({
          goalsArgs: {
            goalConnections,
            goalMessages,
          },
          email: email || "",
        });
      }
    }
  };

  const handleConnectionClick = useCallback(() => {
    setIsMessageInput(false);
    setGoalConnections(goalConnections || 0);
    setIsConnectionInput(true);
  }, [goalConnections]);

  const handleMessageClick = useCallback(() => {
    setIsConnectionInput(false);
    setGoalMessages(goalMessages || 0);
    setIsMessageInput(true);
  }, [goalMessages]);

  const handleSetGoalsClick = useCallback(() => {
    router.push(`/goals?${SearchParams.IsFromSettings}=true`);
  }, [router]);

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
          color: "#FB5913",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (goals?.goalConnections === 0 && goals?.goalMessages === 0) {
    return (
      <div className="relative py-8">
        <Grid container alignItems="center" sx={{ px: "16px" }}>
          <Grid item xs={2}>
            <Button
              variant="text"
              onClick={handleBackClick}
              sx={{ px: "6px", ml: "-6px" }}
            >
              <CaretLeft
                size={32}
                className="md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            </Button>
          </Grid>
          <Grid item xs={8} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Edit Goals
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
    <main className="relative min-h-screen pt-4 pb-8 space-y-12">
      <Grid container alignItems="center" sx={{ px: "16px" }}>
        <Grid item xs={4}>
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ px: "6px", ml: "-6px" }}
          >
            <CaretLeft size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </Button>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Edit Goals
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="text"
            onClick={handleDoneClick}
            sx={{ px: "14px", mr: "-14px" }}
            disabled={isSubmitting}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#38ACE2" }}
            >
              {isSubmitting ? "Saving..." : "Done"}
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {errorMessage && (
        <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <div className="px-20">
        <Typography
          variant="h2"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Contacts
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            display: "flex",
            textAlign: "center",
            mt: "16px",
            justifyContent: "center",
          }}
        >
          How many new contacts do you want to make per month?
        </Typography>
        <div className="flex justify-center mt-6">
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              "@media (min-width: 1024px)": {
                width: "60%",
              },
              border: isConnectionInput ? "1px solid #38ACE2" : "none",
              color: isConnectionInput ? "#38ACE2" : "white",
              "&:disabled": {
                color: "white",
              },
            }}
            onClick={handleConnectionClick}
            disabled={isDisabled}
            turnOffRipple={true}
          >
            {goals?.goalConnections === 0 && !isConnectionInput ? (
              "Add custom goal here..."
            ) : (
              <div className="bg-dark-blue">
                <input
                  type="number"
                  className="text-center w-full"
                  ref={connectionInputRef}
                  value={goalConnections || 0}
                  onChange={(e) => setGoalConnections(parseInt(e.target.value))}
                />
              </div>
            )}
          </Button>
        </div>
      </div>
      <div className="px-20">
        <Typography
          variant="h2"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Messages
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            display: "flex",
            textAlign: "center",
            mt: "16px",
            justifyContent: "center",
          }}
        >
          How many messages do you want to reach out to per month?
        </Typography>
        <div className="flex justify-center mt-6">
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              "@media (min-width: 1024px)": {
                width: "60%",
              },
              border: isMessageInput ? "1px solid #38ACE2" : "none",
              color: isMessageInput ? "#38ACE2" : "white",
              "&:disabled": {
                color: "white",
              },
            }}
            onClick={handleMessageClick}
            disabled={isDisabled}
            turnOffRipple={true}
          >
            {goals?.goalMessages === 0 && !isMessageInput ? (
              "Add custom goal here..."
            ) : (
              <div className="bg-dark-blue">
                <input
                  type="number"
                  className="text-center w-full"
                  ref={messageInputRef}
                  value={goalMessages || 0}
                  onChange={(e) => setGoalMessages(parseInt(e.target.value))}
                />
              </div>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
