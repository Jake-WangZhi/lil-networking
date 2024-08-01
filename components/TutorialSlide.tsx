import { Slide } from "@/types";
import { Typography } from "@mui/material";
import Image from "next/image";
import { useWindowWidth } from "@react-hook/window-size";
import { getVisibleWidth } from "@/lib/utils";

interface Props {
  slide: Slide;
}

export const TutorialSlide = ({ slide }: Props) => {
  const containerWidth =
    Math.floor(getVisibleWidth(useWindowWidth()) * 0.9) - 32;

  return (
    <div className="space-y-6 flex flex-col justify-center items-center">
      <div
        className="h-[186px] bg-dark-blue flex justify-center items-center"
        style={{ width: `${containerWidth}px` }}
      >
        <Image alt={slide.title} src={slide.image} />
      </div>
      <div className="space-y-2">
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          {slide.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          {slide.description}
        </Typography>
      </div>
    </div>
  );
};
