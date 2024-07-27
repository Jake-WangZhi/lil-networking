"use client";

import { AddContactTooltipButton } from "@/components/AddContactTooltipButton";
import { ContactList } from "@/components/ContactList";
import { NavFooter } from "@/components/NavFooter";
import { SearchBar } from "@/components/SearchBar";
import { useContacts } from "@/hooks/useContacts";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

export default function ContactsPage() {
  const { email } = useUser();
  const [name, setName] = useState("");

  const { contacts, isLoading, isError } = useContacts({
    userEmail: email,
    name,
  });

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
        <div className="flex justify-between items-center">
          <Typography variant="h1">All Contacts</Typography>
          <AddContactTooltipButton hasContacts={contacts?.length !== 0} />
        </div>
        {(name || (!isError && !isLoading && contacts?.length !== 0)) && (
          <SearchBar name={name} setName={setName} />
        )}
      </div>
      <ContactList
        contacts={contacts}
        isLoading={isLoading}
        isError={isError}
        name={name}
      />
      <NavFooter />
    </main>
  );
}
