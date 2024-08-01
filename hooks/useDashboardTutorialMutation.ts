import { SearchParams } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

type HandleDashboardTutorialArgs = {
  email: string;
  status: boolean;
};

export const useDashboardTutorialMutation = ({ onSuccess, onError }: Args) =>
  useMutation({
    mutationFn: async ({ email, status }: HandleDashboardTutorialArgs) => {
      const response = await fetch(
        `/dashboard/api?${SearchParams.Email}=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
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
