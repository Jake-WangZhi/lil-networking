"use client";

import "../styles.css";
import { ContactDetails } from "@/components/ContactDetails";
import { useContact } from "@/hooks/useContact";
import { ClipLoader } from "react-spinners";
import { ContactHeader } from "@/components/ContactHeader";
import { Typography } from "@mui/material";
import { NavFooter } from "@/components/NavFooter";

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

  return (
    <main className="relative min-h-screen py-8 text-white">
      <ContactHeader contact={contact} />
      <ContactDetails
        contact={contact}
        isError={isError}
        isLoading={isLoading}
      />
      <NavFooter />
    </main>
  );
}
