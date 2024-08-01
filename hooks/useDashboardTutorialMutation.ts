import { SearchParams } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

type HandleDashboardTutorialArgs = {
  email: string;
};

export const useDashboardTutorialMutation = ({ onSuccess, onError }: Args) =>
  useMutation({
    mutationFn: async ({ email }: HandleDashboardTutorialArgs) => {
      const response = await fetch(
        `/dashboard/api?${SearchParams.Email}=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update DashboardTutorial");
      }
    },
    onSuccess,
    onError,
  });
