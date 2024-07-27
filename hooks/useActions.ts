import { fetcher } from "~/lib/utils";
import { Action, SearchParams } from "~/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  email?: string | null;
};

type ActionType = {
  pastActions: Array<Action>;
  upcomingActions: Array<Action>;
  hasContacts: boolean;
};

export const useActions = ({ email }: Args) => {
  const {
    isError,
    data: actions,
    isLoading,
  } = useQuery<ActionType>({
    queryKey: ["actions", email],
    queryFn: () => fetcher(`/dashboard/api?${SearchParams.Email}=${email}`),
    enabled: !!email,
  });

  return {
    actions,
    isLoading,
    isError,
  };
};
