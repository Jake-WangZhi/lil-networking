import { Slide } from "@/types";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useCallback, useState } from "react";
import { TutorialSlide } from "./TutorialSlide";
import { Button } from "./Button";

interface Props {
  slides: Slide[];
}

export const TutorialModal = ({ slides }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % slides.length;
      console.log("Moving to next slide:", newIndex);
      return newIndex;
    });
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    console.log("haha");
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + slides.length) % slides.length;
      console.log("Moving to previous slide:", newIndex);
      return newIndex;
    });
  }, [slides.length]);

  console.log("Current index:", currentIndex);

  return (
    <div>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <TutorialSlide key={index} slide={slide} />
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => prevSlide}>Disagree</Button>
          <Button onClick={() => setCurrentIndex(1)}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
