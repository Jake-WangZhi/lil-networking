import { fetcher } from "@/lib/utils";
import { Activity } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  contactId: string;
  activityId: string;
};

export const useActivity = ({ contactId, activityId }: Args) => {
  const {
    isLoading,
    data: activity,
    isError,
  } = useQuery<Activity>({
    queryKey: ["activity", activityId],
    queryFn: () =>
      fetcher(`/contacts/${contactId}/activities/${activityId}/api`),
    enabled: !!activityId,
  });

  return {
    activity,
    isLoading,
    isError,
  };
};
