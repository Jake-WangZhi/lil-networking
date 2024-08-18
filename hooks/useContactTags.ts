import { fetcher } from "@/lib/utils";
import { SearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  userEmail?: string | null;
  name?: string | null;
};

type ContactTags = {
  tags: string[];
};

export const useContactTags = ({ userEmail, name }: Args) => {
  const {
    isLoading,
    data: contactTags,
    isError,
    refetch,
  } = useQuery<ContactTags>({
    queryKey: ["contactTags", userEmail, name],
    queryFn: () =>
      fetcher(
        `/contacts/api?${SearchParams.UserEmail}=${userEmail}&${SearchParams.Name}=${name}&totalTags=true`
      ),
    enabled: !!userEmail,
  });

  return {
    contactTags,
    isLoading,
    isError,
    refetch,
  };
};
