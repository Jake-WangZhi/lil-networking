"use client";

import { useContact } from "@/hooks/useContact";
import { Typography } from "@mui/material";
import { ContactTags } from "@/components/profile/ContactTags";
import { SwipeableActivities } from "@/components/messages/SwipeableActivities";
import { ClipLoader } from "react-spinners";
import { MessageCard } from "@/components/messages/MessageCard";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { MessageActions } from "@/components/messages/MessageActions";

import "../../styles.css";

export default function MessagePage({
  params,
}: {
  params: { contactId: string };
}) {
  const { contactProfile, isLoading, isError } = useContact({
    id: params.contactId,
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

  if (!contactProfile?.contact) {
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
        No contact available
      </Typography>
    );
  }

  const { contact } = contactProfile;
  const { firstName, activities, interests } = contact;

  return (
    <main className="relative min-h-screen text-white pb-8 flex flex-col justify-between">
      <div>
        <MessageHeader firstName={firstName} contactId={params.contactId} />
        <MessageCard contact={contact} />
        <SwipeableActivities activities={activities.slice(0, 3)} />
        {interests.length !== 0 && <ContactTags interests={interests} />}
      </div>
      <MessageActions contact={contact} />
    </main>
  );
}
