import { GoalsArgs, SearchParams } from "~/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  method: "POST" | "PUT";
};

type HandleSetGoalsArgs = {
  email: string;
  goalsArgs: GoalsArgs;
};

export const useGoalsMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async ({ email, goalsArgs }: HandleSetGoalsArgs) => {
      const response = await fetch(
        `/settings/goals/api?${SearchParams.Email}=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(goalsArgs),
          method,
        }
      );

      if (!response.ok) {
        throw new Error("Unable to set goals");
      }
    },
    onSuccess,
    onError,
  });
