import { fetcher } from "@/lib/utils";
import { Quote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useQuote = () => {
  const {
    isError,
    data: quote,
    isLoading,
  } = useQuery<Quote>({
    queryKey: ["quote"],
    queryFn: () => fetcher(`/quote/api`),
  });

  return {
    quote,
    isLoading,
    isError,
  };
};
