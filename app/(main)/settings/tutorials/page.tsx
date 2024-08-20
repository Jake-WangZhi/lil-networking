"use client";

import { Button } from "@/components/Button";
import { Grid, Typography } from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function TutorialPage() {
  const router = useRouter();

  const handleBackClick = useCallback(() => {
    router.push("/settings");
  }, [router]);

  return (
    <main className="relative min-h-screen pt-4 pb-8 space-y-12 px-4">
      <Grid container alignItems="center" sx={{ px: "16px" }}>
        <Grid item xs={4}>
          <Button
            variant="text"
            onClick={handleBackClick}
            sx={{ px: "6px", ml: "-6px" }}
          >
            <CaretLeft size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </Button>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Tutorials
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Dashboard
            </Typography>
            <Typography variant="body1">
              Add Contacts, Goals, and Sections
            </Typography>
          </div>
          <div>
            <Button variant="contained" sx={{ px: "32px" }}>
              View
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              All Contacts
            </Typography>
            <Typography variant="body1">
              Add, Search, and Filter Contacts
            </Typography>
          </div>
          <div>
            <Button variant="contained" sx={{ px: "32px" }}>
              View
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Contact Profile
            </Typography>
            <Typography variant="body1">
              Reminders, Tags, and History
            </Typography>
          </div>
          <div>
            <Button variant="contained" sx={{ px: "32px" }}>
              View
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
