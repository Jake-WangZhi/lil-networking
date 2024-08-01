import { Slide } from "@/types";
import { Typography } from "@mui/material";
import Image from "next/image";
import { useWindowWidth } from "@react-hook/window-size";

interface Props {
  slide: Slide;
}

export const TutorialSlide = ({ slide }: Props) => {
  const getVisibleWidth = (windowWidth: number) => {
    if (windowWidth >= 1024) {
      return 768;
    } else if (windowWidth >= 768) {
      return 576;
    } else {
      return windowWidth;
    }
  };

  const containerWidth =
    Math.floor(getVisibleWidth(useWindowWidth()) * 0.9) - 32;

  return (
    <div className="space-y-2 flex flex-col justify-center items-center">
      <div
        className="h-[186px] bg-dark-blue flex justify-center items-center"
        style={{ width: `${containerWidth}px` }}
      >
        <Image alt={slide.title} src={slide.image} />
      </div>
      <Typography variant="h2">{slide.title}</Typography>
      <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
        {slide.description}
      </Typography>
    </div>
  );
};
