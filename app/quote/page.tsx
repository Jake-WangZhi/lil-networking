"use client";

import { Button } from "@/components/Button";
import { useQuote } from "@/hooks/useQuote";
import { formatTitles } from "@/lib/utils";
import { SearchParams } from "@/types";
import { Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

export default function QuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { quote, isLoading, isError } = useQuote();

  if (isError) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-5">
        <Typography variant="body1">
          Something went wrong, please try again later
        </Typography>
        <div className="mt-40 w-full">
          <Button
            variant="contained"
            sx={{ width: "164px" }}
            onClick={() =>
              router.push(searchParams?.get(SearchParams.RedirectPath) || "")
            }
          >
            Next
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center">
        <ClipLoader color="#38ACE2" size={150} />
      </main>
    );
  }

  if (!quote) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-5">
        <Typography variant="body1">No Quote Available</Typography>
        <div className="mt-40 w-full">
          <Button
            variant="contained"
            sx={{ width: "164px" }}
            onClick={() =>
              router.push(searchParams?.get(SearchParams.RedirectPath) || "")
            }
          >
            Next
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative text-center px-5">
      <div className="h-[80vh] flex flex-col justify-center items-center">
        <Typography variant="h2">{quote.text}</Typography>
        {quote.author && (
          <Typography variant="h2" sx={{ color: "#FFCF79", mt: "24px" }}>
            {`-${quote.author}`}
          </Typography>
        )}
        {quote.titles.length !== 0 && (
          <Typography variant="h3" sx={{ color: "#38ACE2", mt: "16px" }}>
            {formatTitles(quote.titles)}
          </Typography>
        )}
      </div>
      <div className="w-full">
        <Button
          variant="contained"
          sx={{ width: "164px" }}
          onClick={() =>
            router.push(searchParams?.get(SearchParams.RedirectPath) || "")
          }
        >
          Next
        </Button>
      </div>
    </main>
  );
}
