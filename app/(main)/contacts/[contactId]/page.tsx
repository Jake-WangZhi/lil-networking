"use client";

import "../styles.css";
import { useContact } from "~/hooks/useContact";
import { ClipLoader } from "react-spinners";
import { ContactHeader } from "~/components/ContactHeader";
import { Typography } from "@mui/material";
import { NavFooter } from "~/components/NavFooter";
import { ContactActivites } from "~/components/ContactActivities";
import { ContactInfo } from "~/components/ContactInfo";
import { ContactInterests } from "~/components/ContactInterests";

export default function ContactPage({
  params,
}: {
  params: { contactId: string };
}) {
  const { contact, isLoading, isError } = useContact({
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
          color: "#F42010",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (!contact) {
    return (
      <Typography
        variant="h3"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#F42010",
        }}
      >
        No contact available
      </Typography>
    );
  }

  const { interests, activities } = contact;

  return (
    <main className="relative min-h-screen pb-8 text-white">
      <ContactHeader contact={contact} />
      <ContactInfo contact={contact} />
      {interests.length !== 0 && <ContactInterests interests={interests} />}
      <ContactActivites activities={activities} contactId={contact.id} />
      <NavFooter />
    </main>
  );
}
