"use client";

import "react-tagsinput/react-tagsinput.css";
import "../../styles.css";
import { useContact } from "@/hooks/useContact";
import { ContactForm } from "@/components/ContactForm";
import { ClipLoader } from "react-spinners";
import { Typography } from "@mui/material";

export default function EditPage({
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
          color: "#F42010",
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
          color: "#F42010",
        }}
      >
        No contact available
      </Typography>
    );
  }

  return <ContactForm contact={contactProfile.contact} />;
}
