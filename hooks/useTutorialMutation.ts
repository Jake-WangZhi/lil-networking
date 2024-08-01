import { SearchParams, TutorialType } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
};

type HandleDashboardTutorialArgs = {
  email: string;
  type: TutorialType;
  status: boolean;
};

export const useTutorialMutation = ({ onSuccess, onError }: Args) =>
  useMutation({
    mutationFn: async ({
      email,
      type,
      status,
    }: HandleDashboardTutorialArgs) => {
      const response = await fetch(
        `/api/tutorial?${SearchParams.Email}=${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, status }),
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
