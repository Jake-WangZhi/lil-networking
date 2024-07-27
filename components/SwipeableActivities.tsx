import { Card, CardContent, Typography } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper";
import { Activity } from "@/types";
import { formatDate } from "@/lib/utils";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

interface Props {
  activities: Activity[];
}

export const SwipeableActivities = ({ activities }: Props) => {
  return (
    <div className="space-y-4 ml-4 my-6">
      <Typography variant="subtitle1">Most recent Activity</Typography>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={16}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="!pb-10"
      >
        {activities.map((activity, index) => (
          <SwiperSlide key={`interest-${index}`} className="!w-[342px]">
            <Card
              sx={{
                height: "184px",
              }}
            >
              <CardContent>
                <div className="flex justify-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                </div>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.7, marginBottom: "8px" }}
                >
                  {formatDate(activity.date)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 5,
                  }}
                >
                  {activity.description}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
