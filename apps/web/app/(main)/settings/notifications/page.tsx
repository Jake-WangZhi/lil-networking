"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Grid, Switch, Typography } from "@mui/material";
import { Button } from "~/components/Button";
import { ChevronLeft } from "react-feather";
import { useRouter } from "next/navigation";
import { urlBase64ToUint8Array } from "~/lib/utils";
import { SubscriptionArgs } from "~/types";
import { useSubscriptionMutation } from "~/hooks/useSubscription";
import { useNotificationSettings } from "~/hooks/useNotificationSettings";
import { useNotificationSettingsMutation } from "~/hooks/useNotificationSettingsMutation";
import { useUser } from "~/contexts/UserContext";

export default function NotificationSettingPage() {
  const { email } = useUser();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState("");
  const { notificationSettings } = useNotificationSettings({
    endpoint,
  });

  const [allNotificationsChecked, setAllNotificationsChecked] = useState(false);
  const [newActionChecked, setNewActionChecked] = useState(false);
  const [streakChecked, setStreakChecked] = useState(false);
  const [meetGoalChecked, setMeetGoalChecked] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [showDefaultNote, setShowDefaultNote] = useState(true);
  const [showDeniedNote, setShowDeniedNote] = useState(false);

  const postSubscriptionMutation = useSubscriptionMutation({
    method: "POST",
    onSuccess: ({ id }) => {
      setSubscriptionId(id);

      postNotificationSettingsMutation.mutate({
        newAction: newActionChecked,
        streak: streakChecked,
        meetGoal: meetGoalChecked,
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
    onSuccess: () => {},
    onError: () => {},
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

      if (permission === "denied") {
        setShowDefaultNote(false);
        setShowDeniedNote(true);
        return;
      }

      setShowDefaultNote(false);

      if (prevPermission === "default" && permission === "granted") {
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

        setAllNotificationsChecked(true);
        setNewActionChecked(true);
        setStreakChecked(true);
        setMeetGoalChecked(true);
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

  const isNotificationModificationAllowed = useCallback(async () => {
    if ("Notification" in window) {
      const result = await window.Notification.requestPermission();

      if (result === "granted") {
        setShowDeniedNote(false);
        return true;
      }
    }

    return false;
  }, []);

  const switchAllNotifications = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (await isNotificationModificationAllowed()) {
        setAllNotificationsChecked(checked);
        setNewActionChecked(checked);
        setStreakChecked(checked);
        setMeetGoalChecked(checked);
      }
    },
    [isNotificationModificationAllowed]
  );

  const switchNewAction = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (await isNotificationModificationAllowed())
        setNewActionChecked(checked);
    },
    [isNotificationModificationAllowed]
  );

  const switchStreak = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (await isNotificationModificationAllowed()) setStreakChecked(checked);
    },
    [isNotificationModificationAllowed]
  );

  const switchMeetGoal = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (await isNotificationModificationAllowed())
        setMeetGoalChecked(checked);
    },
    [isNotificationModificationAllowed]
  );

  const handleBackClick = useCallback(async () => {
    router.push("/settings");

    if (
      !("Notification" in window) ||
      window.Notification.permission !== "granted"
    ) {
      return;
    }

    if (subscriptionId)
      return putNotificationSettingsMutation.mutate({
        newAction: newActionChecked,
        streak: streakChecked,
        meetGoal: meetGoalChecked,
        subscriptionId,
      });

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
  }, [
    router,
    subscriptionId,
    putNotificationSettingsMutation,
    newActionChecked,
    streakChecked,
    meetGoalChecked,
    postSubscriptionMutation,
    email,
  ]);

  return (
    <main className="relative min-h-screen py-8 px-4">
      <Grid container alignItems="center">
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
            Manage Notifications
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      {showDefaultNote && (
        <Typography variant="subtitle1" sx={{ mt: "16px" }}>
          IOS notifications require version 16.5 or later
        </Typography>
      )}
      {showDeniedNote && (
        <Typography variant="subtitle1" sx={{ mt: "16px" }}>
          Your device notifications are turned off. To control what
          notifications you receive, turn on notifications in your device
          settings
        </Typography>
      )}
      <div className="flex justify-between mt-6">
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
        />
      </div>
      <div className="mt-8 space-y-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Push notifications
        </Typography>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                New action alert
              </Typography>
              <Typography variant="body1">
                New actions on your dashboard
              </Typography>
            </div>
            <Switch onChange={switchNewAction} checked={newActionChecked} />
          </div>
          <div className="flex justify-between">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Streak reminder
              </Typography>
              <Typography variant="body1">
                One week before losing streak
              </Typography>
            </div>
            <Switch onChange={switchStreak} checked={streakChecked} />
          </div>
          <div className="flex justify-between">
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Meet goal reminder
              </Typography>
              <Typography variant="body1">
                No activity in more than a week
              </Typography>
            </div>
            <Switch onChange={switchMeetGoal} checked={meetGoalChecked} />
          </div>
        </div>
      </div>
    </main>
  );
}
