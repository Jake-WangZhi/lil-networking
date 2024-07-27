"use client";

import { Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef } from "swiper";
import { Button } from "~/components/Button";
import { ChevronRight, ChevronLeft } from "react-feather";
import { ProgressBar } from "~/components/ProgressBar";
import { useGoalsMutation } from "~/hooks/useGoalsMutation";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoalQuestions } from "~/components/GoalQuestions";
import { SearchParams } from "~/types";
import { event } from "nextjs-google-analytics";

import "swiper/css";

export default function GoalsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isFromSettings = searchParams?.get(SearchParams.IsFromSettings);
  const swiperRef = useRef<SwiperRef>();

  const [progress, setProgress] = useState(0);
  const [networkingComfortLevel, setNetworkingComfortLevel] = useState(1);
  const [goalConnections, setGoalConnections] = useState(2);
  const [goalMessages, setGoalMessages] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");

  const postGoalsMutation = useGoalsMutation({
    method: "POST",
    onSuccess: () => {
      setErrorMessage("");

      const email = session?.user?.email;
      if (email)
        event(`goals_setup`, {
          label: email,
        });

      if (isFromSettings) return router.push("/settings/goals");
      router.push("/dashboard");
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
    },
  });

  const handleDoneClick = useCallback(
    () =>
      postGoalsMutation.mutate({
        goalsArgs: {
          networkingComfortLevel,
          goalConnections,
          goalMessages,
        },
        email: session?.user?.email || "",
      }),
    [
      goalConnections,
      goalMessages,
      networkingComfortLevel,
      postGoalsMutation,
      session?.user?.email,
    ]
  );

  const GOAL_QUESTIONS = useMemo(
    () => [
      {
        title: "How comfortable are you with networking?",
        setValue: setNetworkingComfortLevel,
        selectedValue: networkingComfortLevel,
        buttonContents: [
          {
            label: "Beginner",
            value: 1,
          },
          {
            label: "Advanced",
            value: 2,
          },
          {
            label: "Power networker",
            value: 3,
          },
        ],
      },
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
    [goalConnections, goalMessages, networkingComfortLevel]
  );

  const handleNextClick = useCallback(() => {
    swiperRef.current?.slideNext();
    setProgress((prev) => prev + 1);
  }, []);

  const handlePrevClick = useCallback(() => {
    swiperRef.current?.slidePrev();
    setProgress((prev) => prev - 1);
  }, []);

  return (
    <main className="relative px-8 py-8">
      <ProgressBar title={"Goal"} progress={progress} />
      <div className="px-4">
        <Swiper
          allowTouchMove={false}
          spaceBetween={48}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {GOAL_QUESTIONS.map(
            ({ title, selectedValue, setValue, buttonContents }, index) => {
              return (
                <SwiperSlide key={`question-${index}`}>
                  <GoalQuestions
                    title={title}
                    setValue={setValue}
                    selectedValue={selectedValue}
                    buttonContents={buttonContents}
                  />
                </SwiperSlide>
              );
            }
          )}
          <SwiperSlide>
            <div className="mt-60 flex flex-col justify-center items-center">
              {errorMessage && (
                <Typography variant="subtitle2">{errorMessage}</Typography>
              )}
              <div className="mb-6 space-y-2">
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 600, textAlign: "center" }}
                >
                  You’re all set to connect!
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  you can edit your goals at any time.
                </Typography>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    variant="contained"
                    onClick={handleDoneClick}
                    sx={{
                      width: isFromSettings && "124px",
                    }}
                  >
                    {isFromSettings ? "Done" : "Go to dashboard"}
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="text"
                    sx={{ px: "12px" }}
                    onClick={handlePrevClick}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {progress !== 3 && (
            <div className="flex justify-between items-center">
              <div>
                {progress !== 0 && (
                  <Button
                    variant="text"
                    sx={{ px: "12px" }}
                    onClick={handlePrevClick}
                  >
                    <ChevronLeft
                      size={16}
                      className="md:w-5 md:h-5 lg:w-6 lg:h-6"
                    />
                    Back
                  </Button>
                )}
              </div>
              <div>
                <Button variant="contained" onClick={handleNextClick}>
                  Next
                  <ChevronRight
                    size={16}
                    className="md:w-5 md:h-5 lg:w-6 lg:h-6"
                  />
                </Button>
              </div>
            </div>
          )}
        </Swiper>
      </div>
    </main>
  );
}
