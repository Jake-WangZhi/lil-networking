import { Typography } from "@mui/material";
import { CalendarBlank } from "@phosphor-icons/react";
import { addDays, format, parseISO } from "date-fns";

interface Props {
  goalDays: number;
  lastActivityDate: string;
}

export const ContactReminder = ({ goalDays, lastActivityDate }: Props) => {
  const nextDate = addDays(parseISO(lastActivityDate), goalDays);
  const formattedNextDate = format(nextDate, "MMM dd, yyyy");

  return (
    <div className="space-y-3 mb-6 mx-4">
      <Typography variant="h3" sx={{ fontWeight: 600 }}>
        Reminder
      </Typography>
      <div className="flex gap-3">
        <CalendarBlank size={24} />
        <div className="space-y-1">
          <Typography variant="subtitle1">{`Every ${goalDays} Days`}</Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "white" }}
          >{`Next: ${formattedNextDate}`}</Typography>
        </div>
      </div>
    </div>
  );
};
