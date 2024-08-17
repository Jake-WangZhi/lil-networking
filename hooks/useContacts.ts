import { fetcher } from "@/lib/utils";
import { ContactCardType, SearchParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  userEmail?: string | null;
  name?: string | null;
};

type ContactsType = {
  contacts: ContactCardType[];
  hasViewedContactsTutorial: boolean;
};

export const useContacts = ({ userEmail, name }: Args) => {
  const {
    isLoading,
    data: contactList,
    isError,
    refetch,
  } = useQuery<ContactsType>({
    queryKey: ["contacts", userEmail, name],
    queryFn: () =>
      fetcher(
        `/contacts/api?${SearchParams.UserEmail}=${userEmail}&${SearchParams.Name}=${name}`
      ),
    enabled: !!userEmail,
  });

  return {
    contactList,
    isLoading,
    isError,
    refetch,
  };
};
