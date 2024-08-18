import { fetcher } from "@/lib/utils";
import { SearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  userEmail?: string | null;
  name?: string | null;
  tags?: string[] | null;
};

type ContactCount = {
  count: number;
};

export const useContactCount = ({ userEmail, name, tags }: Args) => {
  const {
    isLoading,
    data: contactCount,
    isError,
    refetch,
  } = useQuery<ContactCount>({
    queryKey: ["contactCount", userEmail, name, tags],
    queryFn: () =>
      fetcher(
        `/contacts/api?${SearchParams.UserEmail}=${userEmail}&${
          SearchParams.Name
        }=${name}&${SearchParams.Tags}=${tags?.join(",")}&count=true`
      ),
    enabled: !!userEmail,
  });

  return {
    contactCount,
    isLoading,
    isError,
    refetch,
  };
};
