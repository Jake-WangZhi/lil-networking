import { Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import { Button } from "./Button";

interface Props {
  title: string;
  description?: string;
  image: StaticImageData;
  addImgPadding?: boolean;
  handleNextClick: () => void | undefined;
}

export const OnboardingIntroPage = ({
  title,
  description,
  image,
  addImgPadding,
  handleNextClick,
}: Props) => {
  return (
    <div className="bg-dark-blue">
      <div
        className={`flex flex-col h-[400px] xs:h-[475px] lg:h-[650px] justify-end ${
          addImgPadding && "px-8 md:px-10 lg:px-12"
        }`}
      >
        <Image src={image} alt={title} className="w-full" />
      </div>
      <div className="px-6 text-white mt-12 space-y-6">
        <Typography variant="h1">{title}</Typography>
        <Typography variant="h3">{description}</Typography>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          variant="contained"
          onClick={handleNextClick}
          sx={{
            width: "172px",
            height: "48px",
            py: "12px",
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
