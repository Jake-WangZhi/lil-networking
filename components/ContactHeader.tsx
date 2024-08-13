import { useBackPath } from "@/contexts/BackPathContext";
import { useContactMutation } from "@/hooks/useContactMutation";
import { DotsThreeCircleVertical } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Edit, Archive, Trash2, X } from "react-feather";
import { Contact, SearchParams } from "@/types";
import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import { Button } from "./Button";
import { AlertDialog } from "./AlertDialog";
import { event } from "nextjs-google-analytics";
import { useUser } from "@/contexts/UserContext";

interface Props {
  contact: Contact;
}

export const ContactHeader = ({ contact }: Props) => {
  const router = useRouter();
  const { email } = useUser();
  const { backPath } = useBackPath();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const isChanged = searchParams?.get(SearchParams.IsChanged);
  const isFromMessage = searchParams?.get(SearchParams.IsFromMessage);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [errorMessage, setErrorMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [action, setAction] = useState<"delete" | "archive">();
  const [alertDescription, setAlertDescription] = useState("");

  const deleteContactMutation = useContactMutation({
    method: "DELETE",
    onSuccess: () => {
      setErrorMessage("");
      router.push(backPath);
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

      if (email)
        event(`contact_${!contact.isArchived ? "archived" : "unarchived"}`, {
          label: email,
        });

      queryClient.refetchQueries(["contact", contact.id]);
    },
    onError: (error) => {
      setErrorMessage("An error occurred. Please try again.");
      console.log(error);
    },
  });

  const handleDropdownClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleDropdownClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setAction("delete");
    setAlertDescription(
      "Deleting this contact will remove them from the app. This contact will need to be reentered."
    );
    setIsAlertOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    (isActive: boolean) => () => {
      if (isActive) {
        setAction("archive");
        setAlertDescription(
          "Archiving this contact will remove them the dashboard."
        );
        setIsAlertOpen(true);
      } else {
        updateContactMutation.mutate({
          id: contact.id,
          isArchived: !contact.isArchived,
        });
      }
    },
    [contact, updateContactMutation]
  );

  const handleConfirmClick = useCallback(() => {
    if (action === "delete") {
      deleteContactMutation.mutate({ id: contact.id });
    } else if (action === "archive") {
      updateContactMutation.mutate({
        id: contact.id,
        isArchived: !contact.isArchived,
      });
    }
    setIsAlertOpen(false);
  }, [action, contact, deleteContactMutation, updateContactMutation]);

  const handleCancelClick = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  const handleBackClick = useCallback(() => {
    if (isChanged) {
      router.push(backPath);
    } else {
      router.back();
    }
  }, [backPath, isChanged, router]);

  const handleEditClick = useCallback(
    () => router.push(`/contacts/${contact.id}/edit`),
    [contact.id, router]
  );

  return (
    <div className="flex items-center sticky top-0 w-full bg-dark-blue z-10 py-2 mb-2 px-4">
      {errorMessage && (
        <Typography
          variant="subtitle2"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {errorMessage}
        </Typography>
      )}
      <div className="w-full flex justify-between items-center">
        <Button
          variant="text"
          onClick={handleBackClick}
          sx={{
            px: isChanged ? "12px" : "6px",
            ml: isChanged ? "-12px" : "-6px",
          }}
        >
          {isChanged ? (
            <X size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
          ) : (
            <ChevronLeft
              size={36}
              className="md:w-10 md:h-10 lg:w-11 lg:h-11"
            />
          )}
        </Button>
        {!isFromMessage && (
          <div className="relative">
            <div className="flex items-center">
              {(contact.type || contact.isArchived) && (
                <div className="bg-white bg-opacity-5 rounded-2xl px-4 py-[6px]">
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {contact.isArchived ? "archived" : contact.type}
                  </Typography>
                </div>
              )}
              <Button
                variant="text"
                sx={{
                  mr: "-12px",
                  px: "12px",
                }}
                onClick={handleDropdownClick}
              >
                <DotsThreeCircleVertical
                  size={24}
                  className="md:w-7 md:h-7 lg:w-8 lg:h-8"
                />
              </Button>
            </div>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleDropdownClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleDropdownClose}>
                <Button
                  onClick={handleEditClick}
                  variant="text"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: "16px",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "black" }}>
                    Edit
                  </Typography>
                  <Edit size={24} />
                </Button>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDropdownClose}>
                <Button
                  onClick={handleStatusChange(!contact.isArchived)}
                  variant="text"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: "16px",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "black" }}>
                    {contact.isArchived ? "Unarchive" : "Archive"}
                  </Typography>
                  <Archive size={24} />
                </Button>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDropdownClose}>
                <Button
                  onClick={handleDeleteClick}
                  variant="text"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: "16px",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.08)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "black" }}>
                    Delete
                  </Typography>
                  <Trash2 size={24} />
                </Button>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
      <AlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title={`Are you sure to you want to ${action} this contact?`}
        description={alertDescription}
        actionButton={
          <Button
            variant="contained"
            onClick={handleConfirmClick}
            sx={{
              zIndex: 10,
              width: "221px",
              ...(action === "delete"
                ? {
                    color: "white !important",
                    backgroundColor: "#FB5913 !important",
                  }
                : {
                    color: "#0F1A24 !important",
                    backgroundColor: "#38ACE2 !important",
                  }),
            }}
          >
            {action === "delete" ? "Delete" : "Allow"}
          </Button>
        }
        cancelButton={
          <Button
            variant="text"
            onClick={handleCancelClick}
            sx={{ zIndex: 10, width: "221px" }}
          >
            Cancel
          </Button>
        }
      />
    </div>
  );
};
