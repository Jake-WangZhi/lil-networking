import { Button } from "@/components/Button";
import { Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Check, Archive } from "react-feather";
import { useContactMutation } from "@/hooks/useContactMutation";
import { ActivityType, Contact, SearchParams } from "@/types";
import { AlertDialog } from "./AlertDialog";
import { useActivityMutation } from "@/hooks/useActivityMutation";
import { useBackPath } from "@/contexts/BackPathContext";
import { convertToLocalizedISODate } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

interface Props {
  contact: Contact;
}

export const MessageActions = ({ contact }: Props) => {
  const router = useRouter();
  const { name } = useUser();
  const { backPath } = useBackPath();
  const searchParams = useSearchParams();
  const isFromProfile = searchParams?.get(SearchParams.IsFromProfile);

  const [isArchiveAlertOpen, setIsArchiveAlertOpen] = useState(false);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const preFilledFormData = useMemo(() => {
    return {
      [SearchParams.Title]: "Messaged",
      [SearchParams.Date]: new Date().toISOString().split("T")[0],
      [SearchParams.Description]: `${name?.split(" ")[0]} reached out to ${
        contact.firstName
      }`,
      [SearchParams.IsFromMessage]: "true",
    };
  }, [contact.firstName, name]);

  const postActivityMutation = useActivityMutation({
    method: "POST",
    onSuccess: ({ showQuote }) => {
      setErrorMessage("");
      const redirectPath = SearchParams.RedirectPath;
      const destinationPath = isFromProfile ? "/contacts" : "/dashboard";

      const path = showQuote
        ? `/quote?${redirectPath}=${destinationPath}`
        : destinationPath;
      router.push(path);
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
    },
  });

  const updateContactMutation = useContactMutation({
    method: "PUT",
    onSuccess: () => {
      setErrorMessage("");
      router.push(backPath);
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
    },
  });

  const handleArchiveClick = useCallback(() => {
    setIsArchiveAlertOpen(true);
  }, []);

  const handleConfirmArchiveClick = useCallback(() => {
    updateContactMutation.mutate({
      id: contact.id,
      isArchived: true,
    });

    setIsArchiveAlertOpen(false);
  }, [contact, updateContactMutation]);

  const handleConfirmEditClick = useCallback(() => {
    setIsEditAlertOpen(false);

    const queryParams = new URLSearchParams({
      ...preFilledFormData,
      ...(isFromProfile && { [SearchParams.IsFromProfile]: "true" }),
    });

    router.push(`/contacts/${contact.id}/activities/create?${queryParams}`);
  }, [contact.id, preFilledFormData, router, isFromProfile]);

  const handleCancelArchiveClick = useCallback(() => {
    setIsArchiveAlertOpen(false);
  }, []);

  const handleCancelEditClick = useCallback(() => {
    setIsEditAlertOpen(false);
    const localizedISODate = convertToLocalizedISODate(preFilledFormData.date);

    postActivityMutation.mutate({
      ...preFilledFormData,
      contactId: contact.id,
      type: ActivityType.User,
      date: localizedISODate,
    });
  }, [contact.id, postActivityMutation, preFilledFormData]);

  const handleDoneClick = useCallback(() => setIsEditAlertOpen(true), []);

  return (
    <>
      {errorMessage && (
        <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <div className="flex justify-center space-x-12">
        <Button
          variant="text"
          sx={{
            flexDirection: "column",
            alignItems: "center",
            px: "24px",
            height: "92px",
            width: "92px",
          }}
          onClick={handleDoneClick}
        >
          <div className="w-12 h-12 bg-light-blue rounded-full flex justify-center items-center mb-1">
            <Check
              size={24}
              color="#0F1A24"
              className="md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </div>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Done
          </Typography>
        </Button>
        <Button
          variant="text"
          sx={{
            flexDirection: "column",
            alignItems: "center",
            px: "24px",
            height: "92px",
            width: "92px",
          }}
          onClick={handleArchiveClick}
        >
          <div className="w-12 h-12 bg-white bg-opacity-5 rounded-full flex justify-center items-center mb-1">
            <Archive size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </div>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Archive
          </Typography>
        </Button>
      </div>
      <AlertDialog
        isOpen={isArchiveAlertOpen}
        setIsOpen={setIsArchiveAlertOpen}
        title={`Are you sure to you want to archive this contact?`}
        description={"Archiving this contact will remove them the dashboard."}
        actionButton={
          <Button
            variant="contained"
            onClick={handleConfirmArchiveClick}
            sx={{
              zIndex: 10,
              width: "221px",
              color: "#0F1A24 !important",
              backgroundColor: "#38ACE2 !important",
            }}
          >
            Allow
          </Button>
        }
        cancelButton={
          <Button
            variant="text"
            onClick={handleCancelArchiveClick}
            sx={{ zIndex: 10, width: "221px" }}
          >
            Cancel
          </Button>
        }
      />
      <AlertDialog
        isOpen={isEditAlertOpen}
        setIsOpen={setIsEditAlertOpen}
        title={"Edit Activity Log?"}
        description={
          "This activity has been logged. Would you like to edit the details"
        }
        actionButton={
          <Button
            variant="contained"
            onClick={handleConfirmEditClick}
            sx={{
              zIndex: 10,
              width: "221px",
              color: "#0F1A24 !important",
              backgroundColor: "#38ACE2 !important",
            }}
          >
            Edit
          </Button>
        }
        cancelButton={
          <Button
            variant="text"
            onClick={handleCancelEditClick}
            sx={{ zIndex: 10, width: "221px" }}
          >
            Not now
          </Button>
        }
      />
    </>
  );
};
