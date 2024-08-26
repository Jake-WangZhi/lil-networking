"use client";

import { useCallback, useEffect, useState } from "react";
import { Grid, Switch, Typography } from "@mui/material";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { urlBase64ToUint8Array } from "@/lib/utils";
import { SubscriptionArgs } from "@/types";
import { useSubscriptionMutation } from "@/hooks/useSubscription";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useNotificationSettingsMutation } from "@/hooks/useNotificationSettingsMutation";
import { useUser } from "@/contexts/UserContext";
import { CaretLeft } from "@phosphor-icons/react";
import { ClipLoader } from "react-spinners";

export default function NotificationSettingPage() {
  const { email } = useUser();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState("");
  const { notificationSettings, isError, isFetching } = useNotificationSettings(
    {
      endpoint,
    }
  );

  const [allNotificationsChecked, setAllNotificationsChecked] = useState(false);
  const [newActionChecked, setNewActionChecked] = useState(false);
  const [streakChecked, setStreakChecked] = useState(false);
  const [meetGoalChecked, setMeetGoalChecked] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [showDefaultNote, setShowDefaultNote] = useState(true);
  const [showDeniedNote, setShowDeniedNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const postSubscriptionMutation = useSubscriptionMutation({
    method: "POST",
    onSuccess: ({ id }) => {
      setSubscriptionId(id);

      setAllNotificationsChecked(true);
      setNewActionChecked(true);
      setStreakChecked(true);
      setMeetGoalChecked(true);

      postNotificationSettingsMutation.mutate({
        newAction: true,
        streak: true,
        meetGoal: true,
        subscriptionId: id,
      });
    },
    onError: () => {},
  });

  const postNotificationSettingsMutation = useNotificationSettingsMutation({
    method: "POST",
    onSuccess: () => {},
    onError: () => {},
  });

  const putNotificationSettingsMutation = useNotificationSettingsMutation({
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

  useEffect(() => {
    if (notificationSettings) {
      const { newAction, streak, meetGoal, subscriptionId } =
        notificationSettings;

      setNewActionChecked(newAction);
      setStreakChecked(streak);
      setMeetGoalChecked(meetGoal);
      setSubscriptionId(subscriptionId);
    }
  }, [notificationSettings]);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && "pushManager" in registration) {
        const pushManager = registration.pushManager;
        if ("getSubscription" in pushManager) {
          const subscription = await pushManager.getSubscription();
          if (subscription) {
            const endpoint = subscription.endpoint;
            setEndpoint(endpoint);
          }
        }
      }
    };

    fetchNotificationSettings();
  }, []);

  useEffect(() => {
    const askForNotificationPermission = async () => {
      if (!("Notification" in window)) return;
      const prevPermission = window.Notification.permission;

      const permission = await window.Notification.requestPermission();

      if (permission === "denied" || permission === "default") {
        setShowDefaultNote(false);
        setShowDeniedNote(true);
        return;
      }

      setShowDefaultNote(false);
      setShowDeniedNote(false);

      if (
        prevPermission === "default" &&
        permission === "granted" &&
        !subscriptionId
      ) {
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
          email: email || "",
          subscription: pushSubscription?.toJSON() as SubscriptionArgs,
        });
      }
    };

    askForNotificationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAllNotificationsChecked(
      newActionChecked && streakChecked && meetGoalChecked
    );
  }, [newActionChecked, streakChecked, meetGoalChecked]);

  useEffect(() => {
    const storeSubscription = async () => {
      if (
        !("Notification" in window) ||
        window.Notification.permission !== "granted"
      ) {
        return;
      }

      //If the permission is granted, but the subscription is not recorded in db, we save the subscription.
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
        email: email || "",
        subscription: pushSubscription?.toJSON() as SubscriptionArgs,
      });
    };

    storeSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchAllNotifications = useCallback(() => {
    setNewActionChecked(!allNotificationsChecked);
    setStreakChecked(!allNotificationsChecked);
    setMeetGoalChecked(!allNotificationsChecked);
    setAllNotificationsChecked((prev) => !prev);
  }, [allNotificationsChecked]);

  const switchNewAction = useCallback(() => {
    setNewActionChecked((prev) => !prev);
  }, []);

  const switchStreak = useCallback(() => {
    setStreakChecked((prev) => !prev);
  }, []);

  const switchMeetGoal = useCallback(() => {
    setMeetGoalChecked((prev) => !prev);
  }, []);

  const handleBackClick = useCallback(() => {
    router.push("/settings");
  }, [router]);

  const handleDoneClick = useCallback(async () => {
    setIsSubmitting(true);

    return putNotificationSettingsMutation.mutate({
      newAction: newActionChecked,
      streak: streakChecked,
      meetGoal: meetGoalChecked,
      subscriptionId,
    });
  }, [
    meetGoalChecked,
    newActionChecked,
    putNotificationSettingsMutation,
    streakChecked,
    subscriptionId,
  ]);

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

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

  return (
    <main className="relative min-h-screen pb-8 px-4 md:pt-4">
      <Grid container alignItems="center">
        <Grid item xs={2.9}>
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ px: "6px", ml: "-6px" }}
          >
            <CaretLeft size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </Button>
        </Grid>
        <Grid
          item
          xs={6.2}
          sx={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Manage Notifications
          </Typography>
        </Grid>
        <Grid
          item
          xs={2.9}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignContent: "center",
          }}
        >
          <Button
            variant="text"
            onClick={handleDoneClick}
            sx={{ px: "14px", mr: "-14px" }}
            disabled={isSubmitting || showDeniedNote || !subscriptionId}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#38ACE2",
                ...((showDeniedNote || !subscriptionId) && {
                  color: "rgba(255, 255, 255, 0.38)",
                }),
              }}
            >
              {isSubmitting ? "Saving..." : "Done"}
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {showDefaultNote && (
        <Typography
          variant="subtitle1"
          sx={{ mt: "16px", color: "rgba(255, 255, 255, 0.7)" }}
        >
          IOS notifications require version 16.5 or later
        </Typography>
      )}
      {showDeniedNote && (
        <Typography
          variant="subtitle1"
          sx={{ mt: "16px", color: "rgba(255, 255, 255, 0.7)" }}
        >
          Your device notifications are turned off. To control what
          notifications you receive, turn on notifications in your device
          settings
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <div className="flex justify-between items-center mt-10">
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Enable all push notifications
          </Typography>
          <Typography variant="body1">
            All mobile notifications will be turned on
          </Typography>
        </div>
        <Switch
          onChange={switchAllNotifications}
          checked={allNotificationsChecked}
          disabled={showDeniedNote}
        />
      </div>
      <div className="mt-10 space-y-6">
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Push notifications
        </Typography>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                New action alert
              </Typography>
              <Typography variant="body1">
                New actions on your dashboard
              </Typography>
            </div>
            <Switch
              onChange={switchNewAction}
              checked={newActionChecked}
              disabled={showDeniedNote}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Streak reminder
              </Typography>
              <Typography variant="body1">
                One week before losing streak
              </Typography>
            </div>
            <Switch
              onChange={switchStreak}
              checked={streakChecked}
              disabled={showDeniedNote}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Meet goal reminder
              </Typography>
              <Typography variant="body1">
                No activity in more than a week
              </Typography>
            </div>
            <Switch
              onChange={switchMeetGoal}
              checked={meetGoalChecked}
              disabled={showDeniedNote}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
