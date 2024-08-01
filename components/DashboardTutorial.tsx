import img1 from "@/public/tutorials/dashboard/contact.png";
import img3 from "@/public/tutorials/dashboard/priority.png";
import img2 from "@/public/tutorials/dashboard/stats.png";
import { TutorialModal } from "./TutorialModal";
import { TutorialType } from "@/types";

export const DashboardTutorial = () => {
  const slides = [
    {
      id: "1",
      title: "Add Contacts",
      description:
        "Create new or easily import contacts from your phone to get started",
      image: img1,
    },
    {
      id: "2",
      title: "Networking Goals",
      description: "Set monthly goals to build and sustain your network",
      image: img2,
    },
    {
      id: "3",
      title: "Contact Reminders",
      description:
        "Automated and priority sorted reminders appear based on individual cadence",
      image: img3,
    },
  ];

  return (
    <TutorialModal slides={slides} tutorialType={TutorialType.Dashboard} />
  );
};
