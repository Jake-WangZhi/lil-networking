import img1 from "@/public/tutorials/contacts/contact.png";
import img2 from "@/public/tutorials/contacts/lists.png";
import img3 from "@/public/tutorials/contacts/search.png";
import { TutorialModal } from "../TutorialModal";
import { TutorialType } from "@/types";

export const ContactsTutorial = () => {
  const slides = [
    {
      id: "1",
      title: "Start by Adding Contacts",
      description:
        "Create new or easily import contacts from your phone to get started",
      image: img1,
    },
    {
      id: "2",
      title: "Browse the List of Contacts",
      description:
        "View and navigate through your list of contacts for easy management",
      image: img2,
    },
    {
      id: "3",
      title: "Search by Name or Tag",
      description:
        "Quickly find contacts using their names or tags for efficient searching",
      image: img3,
    },
  ];

  return <TutorialModal slides={slides} tutorialType={TutorialType.Contacts} />;
};
