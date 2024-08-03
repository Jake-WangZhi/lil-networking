"use client";

import "./styles.css";
import { Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef } from "swiper";
import { Button } from "@/components/Button";
import { ChevronRight, ChevronLeft } from "react-feather";
import { ProgressBar } from "@/components/ProgressBar";
import { useGoalsMutation } from "@/hooks/useGoalsMutation";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoalQuestions } from "@/components/GoalQuestions";
import { SearchParams } from "@/types";
import { event } from "nextjs-google-analytics";
import { X, Lightning } from "@phosphor-icons/react";

import "swiper/css";
import { pauseFor } from "@/lib/utils";

export default function GoalsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isFromSettings = searchParams?.get(SearchParams.IsFromSettings);
  const swiperRef = useRef<SwiperRef>();

  const [progress, setProgress] = useState(0);
  const [goalConnections, setGoalConnections] = useState(2);
  const [goalMessages, setGoalMessages] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

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
          goalConnections,
          goalMessages,
        },
        email: session?.user?.email || "",
      }),
    [goalConnections, goalMessages, postGoalsMutation, session?.user?.email]
  );

  const GOAL_QUESTIONS = useMemo(
    () => [
      {
        title: "Contacts",
        description: "How many new contacts do you want to make per month?",
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
        title: "Messages",
        description: "How many messages do you want to reach out to per month?",
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

  const handleNextClick = useCallback(() => {
    swiperRef.current?.slideNext();
    setProgress((prev) => prev + 1);
  }, []);

  const handlePrevClick = useCallback(() => {
    swiperRef.current?.slidePrev();
    setProgress((prev) => prev - 1);
  }, []);

  const handleBackClick = useCallback(() => {
    setIsNavigatingBack(true);
    pauseFor(500).then(() => router.back());
  }, [router]);

  return (
    <main
      className={`relative px-8 ${
        isNavigatingBack
          ? "animate-slide-out-bottom"
          : "animate-slide-in-bottom"
      }`}
      onAnimationEnd={() => setIsNavigatingBack(false)}
    >
      <Button
        variant="text"
        onClick={handleBackClick}
        sx={{ px: "12px", ml: "-12px", mb: "4px" }}
      >
        <X className="text-2xl md:text-3xl lg:text-4xl" />
      </Button>
      <ProgressBar
        title={"Goal"}
        progress={progress}
        stepCount={GOAL_QUESTIONS.length + 1}
      />
      <div className="px-4">
        <Swiper
          allowTouchMove={false}
          spaceBetween={48}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {GOAL_QUESTIONS.map(
            (
              { title, description, selectedValue, setValue, buttonContents },
              index
            ) => {
              return (
                <SwiperSlide key={`question-${index}`}>
                  <GoalQuestions
                    title={title}
                    description={description}
                    setValue={setValue}
                    selectedValue={selectedValue}
                    buttonContents={buttonContents}
                  />
                </SwiperSlide>
              );
            }
          )}
          <SwiperSlide>
            <div className="mt-20 flex flex-col justify-center items-center">
              {errorMessage && (
                <Typography variant="subtitle2">{errorMessage}</Typography>
              )}
              <div className="mb-6 space-y-12 flex flex-col justify-center items-center">
                <Lightning className="text-primary-yellow text-[86px] md:text-[90px] lg:text-[94px]" />
                <div className="text-center space-y-4 flex flex-col items-center">
                  <div className="space-y-2 w-56 md:w-60 lg:w-64">
                    <Typography variant="h2">Maintain Your Streak</Typography>
                    <Typography variant="body1">
                      Increase your streak by meeting your monthly goals!
                    </Typography>
                  </div>
                  <Typography variant="body1">
                    you can edit your goals at any time
                  </Typography>
                </div>
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
          {progress !== 2 && (
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
