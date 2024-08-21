import { Activity, SearchParams, UserType } from "@/types";
import { useCallback } from "react";
import { Typography } from "@mui/material";
import { Button } from "../Button";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { PlusCircle, Circle, CalendarX } from "@phosphor-icons/react";
import { ActivityCard } from "./ActivityCard";

interface Props {
  activities: Activity[];
  contactId: string;
}

export const ContactActivites = ({ activities, contactId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromMessage = searchParams?.get(SearchParams.IsFromMessage);
  const isFromDashboard = searchParams?.get(SearchParams.IsFromDashboard);

  const handlePlusClick = useCallback(
    () =>
      router.push(
        `/contacts/${contactId}/activities/create${
          isFromDashboard ? `?${SearchParams.IsFromDashboard}=true` : ""
        }`
      ),
    [contactId, isFromDashboard, router]
  );

  return (
    <div className="mx-4">
      <div className="flex items-center justify-between mb-3">
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          History
        </Typography>
        {!isFromMessage && (
          <Button
            onClick={handlePlusClick}
            variant="text"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              px: "8px",
            }}
          >
            <PlusCircle
              size={24}
              className="text-light-blue md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#38ACE2" }}
            >
              Add Activity
            </Typography>
          </Button>
        )}
      </div>
      {activities?.map(
        ({ id, title, date, description, note, type }, index) => (
          <div key={`activity-${index}`}>
            {title ? (
              <Circle
                size={16}
                fill="#38ACE2"
                weight="fill"
                color="#38ACE2"
                className="absolute bg-dark-blue w-4 h-7 flex items-center -mt-2 md:w-5 md:h-8 lg:w-6 lg:h-9"
              />
            ) : (
              <div className="flex">
                <CalendarX
                  size={24}
                  className="text-light-blue -ml-1 md:w-7 md:h-7 lg:w-8 lg:h-8"
                />
                <div className="flex ml-3 gap-1 mt-[2.5px] md:mt-1 lg:mt-1.5">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {UserType.Skipped}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    {formatDate(date)}
                  </Typography>
                </div>
              </div>
            )}
            <div
              className={`flex ml-[7px] md:ml-[9px] lg:ml-[11px] bg-dark-blue ${
                index + 1 !== activities?.length &&
                "border-l-2 border-light-blue border-dashed pb-4"
              }`}
            >
              {title && (
                <ActivityCard
                  contactId={contactId}
                  activityId={id}
                  title={title}
                  date={date}
                  note={note}
                  description={description}
                  type={type}
                />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
