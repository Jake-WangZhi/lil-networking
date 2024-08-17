import { ClipLoader } from "react-spinners";
import { ContactCard } from "./ContactCard";
import { Contact } from "@/types";
import { Typography } from "@mui/material";
import Lottie from "react-lottie";
import animationData from "@/lottie/908-add-and-save.json";

interface Props {
  contacts?: Array<Contact>;
  isLoading: boolean;
  isError: boolean;
  name: string;
}

export const ContactList = ({ contacts, isLoading, isError, name }: Props) => {
  if (isError) {
    return (
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[78vh] flex items-center justify-center mt-5">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (!contacts) {
    return (
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        No contacts available
      </Typography>
    );
  }

  if (!name && !contacts.length) {
    return (
      <div className="h-[78vh] flex flex-col items-center justify-center px-8">
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          width={130}
          height={130}
        />
        <Typography variant="h2">You have no contacts</Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
          Add contacts and build your network
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full mb-24 mt-5">
      <div className="flex items-center space-x-2 mb-2">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
          }}
        >{`All Contacts (${contacts.length})`}</Typography>
      </div>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <ContactCard key={index} contact={contact} />
        ))}
      </div>
    </div>
  );
};
