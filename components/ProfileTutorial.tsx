import img1 from "@/public/tutorials/profile/reminder.png";
import img3 from "@/public/tutorials/profile/tags.png";
import img2 from "@/public/tutorials/profile/history.png";
import { TutorialModal } from "./TutorialModal";
import { TutorialType } from "@/types";

export const ProfileTutorial = () => {
  const slides = [
    {
      id: "1",
      title: "Set Reminders",
      description:
        "Quickly tell when your next reminder for a contact will appear or skip until the next",
      image: img1,
    },
    {
      id: "2",
      title: "Add Tags",
      description:
        "Add tags to catalog interests, industries, or personal priorities",
      image: img2,
    },
    {
      id: "3",
      title: "Log Activities",
      description: "Clear your reminder and visualize your connection history",
      image: img3,
    },
  ];

  return <TutorialModal slides={slides} tutorialType={TutorialType.Profile} />;
};
