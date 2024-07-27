import { fetcher } from "@/lib/utils";
import { Contact } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Args = {
  id: string;
};

export const useContact = ({ id }: Args) => {
  const {
    isLoading,
    data: contact,
    isError,
  } = useQuery<Contact>({
    queryKey: ["contact", id],
    queryFn: () => fetcher(`/contacts/${id}/api`),
    enabled: !!id,
  });

  return {
    contact,
    isLoading,
    isError,
  };
};
