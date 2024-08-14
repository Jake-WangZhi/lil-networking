import { Typography } from "@mui/material";
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
import { useCallback, useState } from "react";
import { ActivityType } from "@/types";

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

  const postActivityMutation = useActivityMutation({
    method: "POST",
    onSuccess: ({}) => {
      setShowSkipButton(false);
      refetch();
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(
        "An error occurred. Cannot submit the form. Please try again."
      );
      console.log(error);
    },
  });

  const handleSkipClick = useCallback(() => {
    postActivityMutation.mutate({
      title: "",
      date: formatISO(new Date()),
      description: "",
      contactId: id,
      type: ActivityType.User,
    });
  }, []);

  return (
    <div className="space-y-3 mb-6 mx-4">
      <Typography variant="h3" sx={{ fontWeight: 600 }}>
        Reminder
      </Typography>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <CalendarBlank size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
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
            sx={{ px: "16px", py: "12px" }}
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
    </div>
  );
};
