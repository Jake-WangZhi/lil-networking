"use client";

import { OnboardingIntroPage } from "@/components/OnboardingIntroPage";
import { OnboardingActionPage } from "@/components/OnboardingActionPage";
import pic1 from "@/public/images/onboarding_pic1.svg";
import pic2 from "@/public/images/onboarding_pic2.svg";
import pic3 from "@/public/images/onboarding_pic3.svg";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

import { Button } from "@/components/Button";
import { ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

const ONBOARDING_INTRO_PAGES = [
  {
    title: "Set Goals",
    description:
      "The Lil Networking app will help you set goals that best fit your needs when it comes to your career.",
    image: pic1,
  },
  {
    title: "Build Relationships",
    description:
      "Build new and existing relationships by staying up to date on their work and interests.",
    image: pic2,
  },
  {
    title: "Stay Connected",
    description:
      "Set notifications to help remind you when to reach out to connections.",
    image: pic3,
  },
];

const SwiperButtonNext = ({ children }: { children: ReactNode }) => {
  const swiper = useSwiper();

  const handleNextClick = useCallback(() => swiper.slideNext(), [swiper]);

  return (
    <Button
      variant="text"
      onClick={handleNextClick}
      sx={{
        width: "172px",
      }}
    >
      {children}
    </Button>
  );
};

export default function OnboardingPage() {
  const router = useRouter();

  const handleSetGoalsClick = useCallback(
    () => router.push("/goals"),
    [router]
  );

  const handleSkipClick = useCallback(
    () => router.push("/dashboard"),
    [router]
  );

  return (
    <main className="relative">
      <Swiper allowTouchMove={false}>
        {ONBOARDING_INTRO_PAGES.map((page, index) => (
          <SwiperSlide key={index}>
            <OnboardingIntroPage
              title={page.title}
              description={page.description}
              image={page.image}
              addImgPadding={index === 1}
            />
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <OnboardingActionPage
            title="Stay Informed"
            actionButton={
              <Button
                variant="contained"
                onClick={() => {}}
                sx={{
                  backgroundColor: "gray !important",
                  cursor: "not-allowed",
                  pointerEvents: "none",
                }}
              >
                Allow notifications
              </Button>
            }
            textButton={<SwiperButtonNext>Not now</SwiperButtonNext>}
          />
        </SwiperSlide>
        <SwiperSlide>
          <OnboardingActionPage
            title="Ready to set a goal?"
            actionButton={
              <Button
                variant="contained"
                onClick={handleSetGoalsClick}
                sx={{ width: "172px" }}
              >
                {"I'm ready"}
              </Button>
            }
            textButton={
              <Button
                variant="text"
                onClick={handleSkipClick}
                sx={{
                  width: "172px",
                }}
              >
                Go to Dashboard
              </Button>
            }
          />
        </SwiperSlide>
      </Swiper>
    </main>
  );
}
