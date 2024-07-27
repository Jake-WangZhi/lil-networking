import { SearchParams, SubscriptionArgs } from "~/types";
import { Subscription } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: (data: Subscription) => void;
  onError: (error: unknown) => void;
  method: "POST";
};

type HandleSetSubscriptionArgs = {
  email: string;
  subscription: SubscriptionArgs;
};

export const useSubscriptionMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async ({ email, subscription }: HandleSetSubscriptionArgs) => {
      const response = await fetch(
        `/api/subscription?${SearchParams.Email}=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
          method,
        }
      );

      if (!response.ok) {
        throw new Error("Unable to set subscription");
      }

      return response.json();
    },
    onSuccess,
    onError,
  });
