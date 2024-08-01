"use client";

import { AddContactTooltipButton } from "@/components/AddContactTooltipButton";
import { ContactList } from "@/components/ContactList";
import { NavFooter } from "@/components/NavFooter";
import { SearchBar } from "@/components/SearchBar";
import { useContacts } from "@/hooks/useContacts";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { ContactsTutorial } from "@/components/ContactsTutorial";
import { pauseFor } from "@/lib/utils";

export default function ContactsPage() {
  const { email } = useUser();
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const { contactList, isLoading, isError } = useContacts({
    userEmail: email,
    name,
  });

  useEffect(() => {
    if (contactList?.hasViewedContactsTutorial === false) {
      pauseFor(1000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [contactList?.hasViewedContactsTutorial]);

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
        <div className="flex justify-between items-center">
          <Typography variant="h1">All Contacts</Typography>
          <AddContactTooltipButton
            hasContacts={contactList?.contacts.length !== 0}
          />
        </div>
        {(name ||
          (!isError && !isLoading && contactList?.contacts.length !== 0)) && (
          <SearchBar name={name} setName={setName} />
        )}
      </div>
      <ContactList
        contacts={contactList?.contacts}
        isLoading={isLoading}
        isError={isError}
        name={name}
      />
      {showTutorial && <ContactsTutorial />}
      <NavFooter />
    </main>
  );
}
