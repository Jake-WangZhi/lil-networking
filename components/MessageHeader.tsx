import { Grid, Typography } from "@mui/material";
import { Button } from "@/components/Button";
import { ChevronLeft } from "react-feather";
import { useRouter, useSearchParams } from "next/navigation";
import { useBackPath } from "@/contexts/BackPathContext";
import { useCallback } from "react";
import { SearchParams } from "@/types";

interface Props {
  firstName: string;
  contactId: string;
}

export const MessageHeader = ({ firstName, contactId }: Props) => {
  const router = useRouter();
  const { backPath } = useBackPath();
  const searchParams = useSearchParams();
  const isFromProfile = searchParams?.get(SearchParams.IsFromProfile);

  const handleBackClick = useCallback(() => {
    if (backPath === "/contacts") {
      router.back();
    } else {
      router.push("/dashboard");
    }
  }, [router, backPath]);

  const handleViewProfileClick = useCallback(() => {
    router.push(`/contacts/${contactId}?${SearchParams.IsFromMessage}=true`);
  }, [contactId, router]);

  return (
    <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8 mb-6 px-4">
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ px: "6px", ml: "-6px" }}
          >
            <ChevronLeft
              size={36}
              className="md:w-11 md:h-11 lg:w-13 lg:h-13"
            />
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 600 }}
          >{`Connect with ${firstName}`}</Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      {!isFromProfile && (
        <div className="flex justify-center">
          <Button variant="text" onClick={handleViewProfileClick}>
            <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
              View profile
            </Typography>
          </Button>
        </div>
      )}
    </div>
  );
};
