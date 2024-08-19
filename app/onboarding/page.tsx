"use client";

import { OnboardingIntroPage } from "@/components/OnboardingIntroPage";
import { OnboardingActionPage } from "@/components/OnboardingActionPage";
import pic1 from "@/public/images/onboarding_pic1.svg";
import pic2 from "@/public/images/onboarding_pic2.svg";
import pic3 from "@/public/images/onboarding_pic3.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef } from "swiper";
import { Button } from "@/components/Button";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { useSubscriptionMutation } from "@/hooks/useSubscription";
import { useSession } from "next-auth/react";
import { SubscriptionArgs } from "@/types";
import { useNotificationSettingsMutation } from "@/hooks/useNotificationSettingsMutation";
import { useGoalsMutation } from "@/hooks/useGoalsMutation";

import "swiper/css";

const ONBOARDING_INTRO_PAGES = [
  {
    title: "Set Goals",
    description:
      "Set, track, and achieve networking goals to expand your network and stay connected with contacts.",
    image: pic1,
  },
  {
    title: "Customization",
    description:
      "Set your reminder cadences to your preferences for effective scheduling.",
    image: pic3,
  },
  {
    title: "Build Relationships",
    description:
      "Track and get helpful reminders of when and what you discussed with your networking contacts to quickly re-engage with them.",
    image: pic2,
  },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const swiperRef = useRef<SwiperRef>();
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const postNotificationSettingsMutation = useNotificationSettingsMutation({
    method: "POST",
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const postSubscriptionMutation = useSubscriptionMutation({
    method: "POST",
    onSuccess: ({ id }) => {
      postNotificationSettingsMutation.mutate({
        newAction: true,
        streak: true,
        meetGoal: true,
        subscriptionId: id,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const putGoalsMutation = useGoalsMutation({
    method: "PUT",
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("serviceworker.js");
    }
  }, []);

  const handleSetGoalsClick = useCallback(
    () => router.push("/goals"),
    [router]
  );

  const handleSkipClick = useCallback(
    () => router.push("/dashboard"),
    [router]
  );

  const handleNextClick = useCallback(() => swiperRef.current?.slideNext(), []);

  const handleNotificationClick = useCallback(async () => {
    if ("Notification" in window) {
      const result = await window.Notification.requestPermission();

      nextButtonRef.current?.click();

      if (result === "granted") {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""
          ),
        };

        const registration = await navigator.serviceWorker.getRegistration();

        const pushSubscription = await registration?.pushManager.subscribe(
          subscribeOptions
        );

        postSubscriptionMutation.mutate({
          email: session?.user?.email || "",
          subscription: pushSubscription?.toJSON() as SubscriptionArgs,
        });
      }
    }
  }, [postSubscriptionMutation, session?.user?.email]);

  useEffect(() => {
    putGoalsMutation.mutate({
      goalsArgs: {
        goalConnections: 0,
        goalMessages: 0,
      },
      email: session?.user?.email || "",
    });
  }, []);

  return (
    <main className="relative">
      <Swiper
        allowTouchMove={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {ONBOARDING_INTRO_PAGES.map((page, index) => (
          <SwiperSlide key={index}>
            <OnboardingIntroPage
              title={page.title}
              description={page.description}
              image={page.image}
              addImgPadding={index === 2}
              handleNextClick={handleNextClick}
            />
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <OnboardingActionPage
            title="Enable Notifications"
            description="iOS notifications require version 16.5 or later"
            actionButton={
              <Button variant="contained" onClick={handleNotificationClick}>
                Allow notifications
              </Button>
            }
            textButton={
              <Button
                variant="text"
                onClick={handleNextClick}
                sx={{
                  width: "172px",
                }}
              >
                Not now
              </Button>
            }
            morePadding={true}
          />
          <button ref={nextButtonRef} onClick={handleNextClick} />;
        </SwiperSlide>
        <SwiperSlide>
          <OnboardingActionPage
            title="Ready To Set Your Networking Goals?"
            description="You can change your goals at anytime"
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
