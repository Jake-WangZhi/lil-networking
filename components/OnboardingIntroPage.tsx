import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  description?: string;
  image: StaticImageData;
  addImgPadding?: boolean;
}

export const OnboardingIntroPage = ({
  title,
  description,
  image,
  addImgPadding,
}: Props) => {
  return (
    <div className="bg-dark-blue">
      <Image
        src={image}
        alt={title}
        className={`bottom-0 h-[450px] xs:h-[525px] w-full ${
          addImgPadding && "px-7"
        }`}
      />
      <div className="px-8 text-white mt-12">
        <h1 className="font-semibold text-3xl pb-6 md:text-5xl">{title}</h1>
        <p className="text-xl font-normal md:text-3xl">{description}</p>
      </div>
    </div>
  );
};
