import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { CalendarBlank } from "@phosphor-icons/react";
import {
  addDays,
  differenceInDays,
  format,
  formatISO,
  parseISO,
} from "date-fns";
import { Button } from "./Button";
import { useActivityMutation } from "@/hooks/useActivityMutation";
import { useCallback, useEffect, useState } from "react";
import { ActivityType } from "@/types";
import { AlertDialog } from "./AlertDialog";

interface Props {
  id: string;
  goalDays: number;
  lastActivityDate: string;
  refetch: () => void;
}

export const ContactReminder = ({
  id,
  goalDays,
  lastActivityDate,
  refetch,
}: Props) => {
  const nextDate = addDays(parseISO(lastActivityDate), goalDays);
  const formattedNextDate = format(nextDate, "MMM dd, yyyy");
  const days = differenceInDays(new Date(), parseISO(lastActivityDate));

  const [errorMessage, setErrorMessage] = useState("");
  const [showSkipButton, setShowSkipButton] = useState(days >= goalDays);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  useEffect(() => {
    setShowSkipButton(days >= goalDays);
  }, [days, goalDays, lastActivityDate]);

  const postActivityMutation = useActivityMutation({
    method: "POST",
    onSuccess: ({}) => {
      refetch();
      setErrorMessage("");
    },
    onError: (error) => {
      setShowSkipButton(true);
      setErrorMessage(
        "An error occurred. Cannot skip the reminder. Please try again."
      );
      console.log(error);
      setShowSkipButton(true);
    },
  });

  const handleSkipClick = useCallback(() => {
    if (localStorage.getItem("skipAlert") === "true") {
      postActivityMutation.mutate({
        title: "",
        date: formatISO(new Date()),
        description: "",
        contactId: id,
        type: ActivityType.User,
      });

      setShowSkipButton(false);
    } else {
      setIsAlertOpen(true);
    }
  }, [id, postActivityMutation]);

  const handleConfirmClick = useCallback(() => {
    if (neverShowAgain) {
      localStorage.setItem("skipAlert", "true");
    }

    postActivityMutation.mutate({
      title: "",
      date: formatISO(new Date()),
      description: "",
      contactId: id,
      type: ActivityType.User,
    });

    setIsAlertOpen(false);
    setShowSkipButton(false);
  }, [id, neverShowAgain, postActivityMutation]);

  const handleCancelClick = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setNeverShowAgain(event.target.checked);
  };

  return (
    <div className="space-y-3 mb-6 mx-4">
      <Typography variant="h3" sx={{ fontWeight: 600 }}>
        Reminder
      </Typography>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <CalendarBlank
            size={24}
            className="mt-0.5 md:-mt-[1px] lg:-mt-0.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
          />
          <div className="space-y-1">
            <Typography variant="subtitle1">{`Every ${goalDays} Days`}</Typography>
            <Typography
              variant="subtitle2"
              sx={{ color: "white" }}
            >{`Next: ${formattedNextDate}`}</Typography>
          </div>
        </div>
        {showSkipButton && (
          <Button
            variant="text"
            sx={{ px: "16px", py: "12px", mb: "-4px" }}
            onClick={handleSkipClick}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#38ACE2" }}
            >
              Skip Reminder
            </Typography>
          </Button>
        )}
      </div>
      {errorMessage && (
        <Typography
          variant="subtitle2"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {errorMessage}
        </Typography>
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title={`Are you sure you want to skip?`}
        description={`This action will skip this cadence. Your next cadence will be ${goalDays} days from now.`}
        neverShowAgain={
          <FormControlLabel
            control={
              <Checkbox
                checked={neverShowAgain}
                onChange={handleCheckboxChange}
                sx={{ color: "white", "&.Mui-checked": { color: "#38ACE2" } }}
              />
            }
            label={
              <Typography variant="body1">
                Don’t show this message again
              </Typography>
            }
          />
        }
        actionButton={
          <Button
            variant="contained"
            onClick={handleConfirmClick}
            sx={{
              zIndex: 10,
              width: "221px",
              color: "#0F1A24 !important",
              backgroundColor: "#38ACE2 !important",
            }}
          >
            Skip Reminder
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
