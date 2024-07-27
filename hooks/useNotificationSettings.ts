import { fetcher } from "@/lib/utils";
import { SearchParams } from "@/types";
import { NotificationSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type Args = {
  endpoint?: string | null;
};

export const useNotificationSettings = ({ endpoint }: Args) => {
  const {
    isError,
    data: notificationSettings,
    isLoading,
  } = useQuery<NotificationSettings>({
    queryKey: ["notificationSettings", endpoint],
    queryFn: () =>
      fetcher(
        `/settings/notifications/api?${SearchParams.Endpoint}=${endpoint}`
      ),
    enabled: !!endpoint,
  });

  return {
    notificationSettings,
    isLoading,
    isError,
  };
};
