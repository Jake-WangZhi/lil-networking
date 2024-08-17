import { ContactCardType, UserType } from "@/types";
import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Chip } from "./Chip";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import { NoteBlank } from "@phosphor-icons/react";

interface Props {
  contact: ContactCardType;
}

export const ContactCard = ({ contact }: Props) => {
  const { id, firstName, lastName, title, interests, note, isArchived } =
    contact;

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Link href={`/contacts/${id}`} className="text-white">
            <div className="flex justify-between items-start">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {firstName} {lastName}
              </Typography>
              {isArchived && <Chip label={UserType.Archived} />}
            </div>
            <div className="flex items-center space-x-2">
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.7,
                }}
              >
                {title}
              </Typography>
            </div>
            {note && (
              <Grid container>
                <Grid item xs={1} sm={0.8} md={0.64}>
                  <NoteBlank
                    size={24}
                    color="white"
                    className="mt-1.5 md:mt-0.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
                  />
                </Grid>
                <Grid item xs={11} sm={11.2} md={11.36}>
                  <Typography variant="body1" sx={{ marginTop: "8px" }}>
                    {note}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {interests.length !== 0 && (
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={8}
                freeMode={true}
                modules={[FreeMode]}
                style={{ zIndex: "0", marginTop: "8px" }}
              >
                {interests?.map((interest, index) => (
                  <SwiperSlide
                    key={`interest-${index}`}
                    className={`!w-auto bg-white bg-opacity-[0.12] rounded-2xl px-4 py-[6px]`}
                  >
                    <Typography variant="body1">{interest}</Typography>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
