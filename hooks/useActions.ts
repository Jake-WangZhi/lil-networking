import { fetcher } from "@/lib/utils";
import { Action, SearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  email?: string | null;
};

type ActionType = {
  priorityActions: Array<Action>;
  upcomingActions: Array<Action>;
  hasContacts: boolean;
  isMeetGoals: boolean;
  hasViewedDashboardTutorial: boolean;
  showConfetti: boolean;
};

export const useActions = ({ email }: Args) => {
  const {
    isError,
    data: actions,
    isLoading,
    refetch,
  } = useQuery<ActionType>({
    queryKey: ["actions", email],
    queryFn: () => fetcher(`/dashboard/api?${SearchParams.Email}=${email}`),
    enabled: !!email,
  });

  return {
    actions,
    isLoading,
    isError,
    refetch,
  };
};
