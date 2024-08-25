"use client";

import "./styles.css";
import { useContact } from "@/hooks/useContact";
import { ClipLoader } from "react-spinners";
import { ContactHeader } from "@/components/profile/ContactHeader";
import { Typography } from "@mui/material";
import { NavFooter } from "@/components/NavFooter";
import { ContactActivites } from "@/components/profile/ContactActivities";
import { ContactInfo } from "@/components/profile/ContactInfo";
import { ContactTags } from "@/components/profile/ContactTags";
import { useEffect, useState } from "react";
import { ProfileTutorial } from "@/components/profile/ProfileTutorial";
import { handleRefresh, pauseFor } from "@/lib/utils";
import { useSettings } from "@/contexts/SettingsContext";
import PullToRefresh from "react-simple-pull-to-refresh";
import { ContactReminder } from "@/components/profile/ContactReminder";
import { ContactConnect } from "@/components/profile/ContactConnect";

export default function ContactPage({
  params,
}: {
  params: { contactId: string };
}) {
  const [showTutorial, setShowTutorial] = useState(false);
  const { isProfileTutorialShown } = useSettings();
  const [isIOS, setIsIOS] = useState(true);

  const { contactProfile, isLoading, isError, refetch, isRefetching } =
    useContact({
      id: params.contactId,
    });

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof window !== "undefined") {
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !(window as any).MSStream
      );
    }
  }, []);

  useEffect(() => {
    if (contactProfile?.hasViewedProfileTutorial === false) {
      pauseFor(3000).then(() => {
        setShowTutorial(true);
      });
    }
  }, [contactProfile?.hasViewedProfileTutorial]);

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

  if (isLoading || isRefetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
  const {
    id,
    firstName,
    lastName,
    title,
    company,
    industry,
    links,
    linkedIn,
    email,
    phone,
    goalDays,
    interests,
    activities,
  } = contact;

  const renderProfile = () => {
    return (
      <div className="min-h-[80vh] mt-2">
        <ContactInfo
          firstName={firstName}
          lastName={lastName}
          industry={industry}
          title={title}
          company={company}
          links={links}
        />
        <ContactReminder
          id={id}
          goalDays={goalDays}
          lastActivityDate={contact.activities[0].date}
          refetch={refetch}
        />
        <ContactConnect linkedIn={linkedIn} email={email} phone={phone} />
        {interests.length !== 0 && <ContactTags interests={interests} />}
        <ContactActivites activities={activities} contactId={contact.id} />
      </div>
    );
  };

  return (
    <main
      className={`relative ${
        isIOS ? "mb-[100px]" : "mb-[86px]"
      } md:mb-24 lg:mb-28 text-white`}
    >
      <ContactHeader contact={contact} />
      <PullToRefresh
        onRefresh={handleRefresh(refetch)}
        resistance={3}
        refreshingContent={
          <ClipLoader color="#38ACE2" size={50} className="mt-5" />
        }
      >
        {renderProfile()}
      </PullToRefresh>
      {showTutorial && isProfileTutorialShown && <ProfileTutorial />}
      <NavFooter />
    </main>
  );
}
