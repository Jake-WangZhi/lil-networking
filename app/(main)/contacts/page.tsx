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
import { Chip } from "@/components/Chip";
import { useContactTags } from "@/hooks/useContactTags";

export default function ContactsPage() {
  const { email } = useUser();
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const { isContactsTutorialShown } = useSettings();
  const [isHiddenPageVisible, setIsHiddenPageVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [tags, setTags] = useState<Array<string>>([]);

  const [clickedTags, setClickedTags] = useState<Array<boolean>>([]);

  const { contactList, isLoading, isError, refetch } = useContacts({
    userEmail: email,
    name,
    tags: selectedTags,
  });

  const { contactTags } = useContactTags({
    userEmail: email,
    name,
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

  useEffect(() => {
    setTags(contactTags?.tags || []);
  }, [contactTags]);

  useEffect(() => {
    const defaultClickedTags = [];
    for (let i = 0; i < tags.length; i++) {
      if (selectedTags.includes(tags[i])) {
        defaultClickedTags.push(true);
      } else {
        defaultClickedTags.push(false);
      }
    }

    setClickedTags(defaultClickedTags);
  }, [tags]);

  console.log("tags", tags);

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
            {selectedTags.length !== 0 && (
              <div className="flex gap-3 pt-2 flex-wrap">
                {selectedTags.map(
                  (tag, index) => tag && <Chip key={index} label={tag} />
                )}
              </div>
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
        setIsHiddenPageVisible={setIsHiddenPageVisible}
        clickedTags={clickedTags}
        setClickedTags={setClickedTags}
        setSelectedTags={setSelectedTags}
        tags={tags}
        email={email || ""}
        name={name}
        selectedTags={selectedTags}
      />
    </main>
  );
}
