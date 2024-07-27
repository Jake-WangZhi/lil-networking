import { fetcher } from "@/lib/utils";
import { SearchParams } from "@/types";
import { Goals } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Args = {
  email?: string | null;
};

export const useGoals = ({ email }: Args) => {
  const {
    isError,
    data: goals,
    isLoading,
  } = useQuery<Goals>({
    queryKey: ["goals", email],
    queryFn: () =>
      fetcher(`/settings/goals/api?${SearchParams.Email}=${email}`),
    enabled: !!email,
  });

  return {
    goals,
    isLoading,
    isError,
  };
};
