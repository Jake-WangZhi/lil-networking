"use client";

import "react-tagsinput/react-tagsinput.css";
import "../../../../styles.css";

import { ClipLoader } from "react-spinners";
import { Typography } from "@mui/material";
import ActivityForm from "@/components/profile/ActivityForm";
import { useActivity } from "@/hooks/useActivity";

export default function EditActivityPage({
  params,
}: {
  params: { contactId: string; activityId: string };
}) {
  const { activity, isLoading, isError } = useActivity({
    contactId: params.contactId,
    activityId: params.activityId,
  });

  if (isError) {
    return (
      <Typography
        variant="h3"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-8">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (!activity) {
    return (
      <Typography
        variant="h3"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        No activity available
      </Typography>
    );
  }

  return <ActivityForm contactId={params.contactId} activity={activity} />;
}
