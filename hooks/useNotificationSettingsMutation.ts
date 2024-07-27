import { NotificationSettingsArgs, SearchParams } from "~/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  method: "POST" | "PUT";
};

export const useNotificationSettingsMutation = ({
  onSuccess,
  onError,
  method,
}: Args) =>
  useMutation({
    mutationFn: async (notificationSettingsArgs: NotificationSettingsArgs) => {
      const response = await fetch(`/settings/notifications/api`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationSettingsArgs),
        method,
      });

      if (!response.ok) {
        throw new Error("Unable to set notifications");
      }
    },
    onSuccess,
    onError,
  });
