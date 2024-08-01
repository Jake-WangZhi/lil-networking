import { Slide, TutorialType } from "@/types";
import { Dialog, DialogActions } from "@mui/material";
import { TutorialSlide } from "./TutorialSlide";
import { Button } from "./Button";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { Paginator } from "./Paginator";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef } from "swiper";
import "swiper/css";
import { useTutorialMutation } from "@/hooks/useTutorialMutation";
import { useUser } from "@/contexts/UserContext";

interface Props {
  slides: Slide[];
  tutorialType: TutorialType;
  setLocalShowTutorial: Dispatch<SetStateAction<boolean>>;
}

export const TutorialModal = ({
  slides,
  tutorialType,
  setLocalShowTutorial,
}: Props) => {
  const swiperRef = useRef<SwiperRef>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const { email } = useUser();

  const tutorialMutation = useTutorialMutation({
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSlideChange = (swiper: SwiperRef) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleNextClick = useCallback(() => {
    if (activeIndex === slides.length - 1) {
      switch (tutorialType) {
        case TutorialType.Dashboard:
          tutorialMutation.mutate({
            email: email || "",
            type: TutorialType.Dashboard,
            status: true,
          });
          break;
        case TutorialType.Contacts:
          tutorialMutation.mutate({
            email: email || "",
            type: TutorialType.Contacts,
            status: true,
          });
          break;
        case TutorialType.Profile:
          tutorialMutation.mutate({
            email: email || "",
            type: TutorialType.Profile,
            status: true,
          });
          break;
      }
      setIsOpen(false);
      setLocalShowTutorial(false);
    } else {
      swiperRef.current?.slideNext();
    }
  }, [
    activeIndex,
    slides.length,
    tutorialType,
    setLocalShowTutorial,
    tutorialMutation,
    email,
  ]);

  const handleSkipClick = useCallback(() => {
    switch (tutorialType) {
      case TutorialType.Dashboard:
        tutorialMutation.mutate({
          email: email || "",
          type: TutorialType.Dashboard,
          status: true,
        });
        break;
      case TutorialType.Contacts:
        tutorialMutation.mutate({
          email: email || "",
          type: TutorialType.Contacts,
          status: true,
        });
        break;
      case TutorialType.Profile:
        tutorialMutation.mutate({
          email: email || "",
          type: TutorialType.Profile,
          status: true,
        });
        break;
    }
    setLocalShowTutorial(false);
    setIsOpen(false);
  }, [tutorialType, setLocalShowTutorial, tutorialMutation, email]);

  const handleDotClick = useCallback((index: number) => {
    swiperRef.current?.slideTo(index);
  }, []);

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogActions>
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            allowTouchMove={false}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="space-y-4"
          >
            <div>
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <TutorialSlide slide={slide} />
                </SwiperSlide>
              ))}
            </div>
            <div className="flex justify-between">
              <Paginator
                activeIndex={activeIndex}
                numDots={slides.length}
                onDotClick={handleDotClick}
              />
              <div>
                <Button
                  variant="text"
                  onClick={handleSkipClick}
                  sx={{
                    px: "24px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "16px",
                    fontWeight: "400",
                  }}
                >
                  Skip
                </Button>
                <Button
                  variant="text"
                  onClick={handleNextClick}
                  sx={{
                    px: "24px",
                    color: "#38ACE2",
                    fontSize: "16px",
                    "&:focus": {
                      color: "#38ACE2",
                    },
                  }}
                >
                  {activeIndex === slides.length - 1 ? "Done" : "Next"}
                </Button>
              </div>
            </div>
          </Swiper>
        </DialogActions>
      </Dialog>
    </div>
  );
};
