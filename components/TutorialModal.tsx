import { Slide, TutorialType } from "@/types";
import { Dialog, DialogActions } from "@mui/material";
import { TutorialSlide } from "./TutorialSlide";
import { Button } from "./Button";
import { useCallback, useRef, useState } from "react";
import { Paginator } from "./Paginator";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef } from "swiper";
import "swiper/css";
import { useTutorialMutation } from "@/hooks/useTutorialMutation";
import { useUser } from "@/contexts/UserContext";
import { useSettings } from "@/contexts/SettingsContext";

interface Props {
  slides: Slide[];
  tutorialType: TutorialType;
}

export const TutorialModal = ({ slides, tutorialType }: Props) => {
  const swiperRef = useRef<SwiperRef>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const { email } = useUser();
  const {
    setIsDashboardTutorialShown,
    setIsContactsTutorialShown,
    setIsProfileTutorialShown,
  } = useSettings();

  const tutorialMutation = useTutorialMutation({
    onSuccess: () => {
      switch (tutorialType) {
        case TutorialType.Dashboard:
          setIsDashboardTutorialShown(false);
          break;
        case TutorialType.Contacts:
          setIsContactsTutorialShown(false);
          break;
        case TutorialType.Profile:
          setIsProfileTutorialShown(false);
          break;
      }
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSlideChange = (swiper: SwiperRef) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleNextClick = useCallback(() => {
    if (activeIndex === slides.length - 1) {
      tutorialMutation.mutate({
        email: email || "",
        type: tutorialType,
        status: true,
      });
    } else {
      swiperRef.current?.slideNext();
    }
  }, [activeIndex, slides.length, tutorialType, tutorialMutation, email]);

  const handleSkipClick = useCallback(() => {
    tutorialMutation.mutate({
      email: email || "",
      type: tutorialType,
      status: true,
    });
  }, [tutorialType, tutorialMutation, email]);

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
