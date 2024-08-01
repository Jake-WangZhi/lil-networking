import { fetcher } from "@/lib/utils";
import { Contact } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  id: string;
};

type ContactsType = {
  contact: Contact;
  hasViewedProfileTutorial: boolean;
};

export const useContact = ({ id }: Args) => {
  const {
    isLoading,
    data: contactProfile,
    isError,
  } = useQuery<ContactsType>({
    queryKey: ["contact", id],
    queryFn: () => fetcher(`/contacts/${id}/api`),
    enabled: !!id,
  });

  return {
    contactProfile,
    isLoading,
    isError,
  };
};
