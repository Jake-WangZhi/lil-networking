import { ActivityArgs } from "@/types";
import { useMutation } from "@tanstack/react-query";

type ActivityResponse = {
  showQuote: boolean;
};

type Args = {
  onSuccess: (data: ActivityResponse) => void;
  onError: (error: unknown) => void;
  method: "DELETE" | "POST";
};

export const useActivityMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async (activityArgs: ActivityArgs) => {
      let url = `/contacts/${activityArgs.contactId}/activities/api`;

      if (method === "DELETE") {
        url = `/contacts/${activityArgs.contactId}/activities/${activityArgs.id}`;
      }

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...(method === "DELETE" ? {} : { body: JSON.stringify(activityArgs) }),
        method,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error("Unable to update");
      }

      return json;
    },
    onSuccess,
    onError,
  });
