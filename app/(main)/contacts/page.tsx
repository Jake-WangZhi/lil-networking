"use client";

import { AddContactTooltipButton } from "@/components/AddContactTooltipButton";
import { ContactList } from "@/components/ContactList";
import { NavFooter } from "@/components/NavFooter";
import { SearchBar } from "@/components/SearchBar";
import { useContacts } from "@/hooks/useContacts";
import { Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { ContactsTutorial } from "@/components/ContactsTutorial";
import { handleRefresh, pauseFor } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import PullToRefresh from "react-simple-pull-to-refresh";
import { ClipLoader } from "react-spinners";
import { FilterPage } from "@/components/FilterPage";

export default function ContactsPage() {
  const { email } = useUser();
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const { isContactsTutorialShown } = useSettings();
  const [isHiddenPageVisible, setIsHiddenPageVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleFilterClick = useCallback(() => {
    setIsHiddenPageVisible(true);
  }, []);

  const handleCloseHiddenPage = useCallback(() => {
    setIsHiddenPageVisible(false);
  }, []);

  const { contactList, isLoading, isError, refetch } = useContacts({
    userEmail: email,
    name,
    tags: selectedTags,
  });

  useEffect(() => {
    if (contactList?.hasViewedContactsTutorial === false) {
      pauseFor(3000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [contactList?.hasViewedContactsTutorial]);

  const renderContacts = () => {
    return (
      <>
        <ContactList
          contacts={contactList?.contacts}
          isLoading={isLoading}
          isError={isError}
          name={name}
        />
      </>
    );
  };

  const tags = new Set(
    contactList?.contacts.map((contact) => contact.interests).flat()
  );

  console.log("selectedTags", selectedTags);

  return (
    <main className="relative flex flex-col items-center text-white px-4">
      {isLoading ? (
        <>
          <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
            <div className="flex justify-between items-center">
              <Typography variant="h1">All Contacts</Typography>
              <div className="-mr-3">
                <AddContactTooltipButton
                  hasContacts={contactList?.contacts.length !== 0}
                  hasShownTutorial={contactList?.hasViewedContactsTutorial}
                />
              </div>
            </div>
            {(name ||
              (!isError &&
                !isLoading &&
                contactList?.contacts.length !== 0)) && (
              <SearchBar
                name={name}
                setName={setName}
                setIsHiddenPageVisible={setIsHiddenPageVisible}
              />
            )}
          </div>
          {renderContacts()}
        </>
      ) : (
        <>
          <div className="sticky top-0 w-full bg-dark-blue z-10 pt-8">
            <div className="flex justify-between items-center">
              <Typography variant="h1">All Contacts</Typography>
              <div className="-mr-3">
                <AddContactTooltipButton
                  hasContacts={
                    contactList?.contacts.length !== 0 || name !== ""
                  }
                  hasShownTutorial={contactList?.hasViewedContactsTutorial}
                />
              </div>
            </div>
            {(name ||
              (!isError &&
                !isLoading &&
                contactList?.contacts.length !== 0)) && (
              <SearchBar
                name={name}
                setName={setName}
                setIsHiddenPageVisible={setIsHiddenPageVisible}
              />
            )}
          </div>
          <PullToRefresh
            onRefresh={handleRefresh(refetch)}
            resistance={3}
            refreshingContent={
              <ClipLoader color="#38ACE2" size={50} className="mt-5" />
            }
          >
            {renderContacts()}
          </PullToRefresh>
        </>
      )}
      {showTutorial && isContactsTutorialShown && <ContactsTutorial />}
      <NavFooter />
      <FilterPage
        isVisible={isHiddenPageVisible}
        onClose={handleCloseHiddenPage}
        setSelectedTags={setSelectedTags}
        tags={[...tags]}
      />
    </main>
  );
}
