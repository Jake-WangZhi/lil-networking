import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  actionButton: ReactNode;
  cancelButton: ReactNode;
}

export const AlertDialog = ({
  isOpen,
  setIsOpen,
  title,
  description,
  actionButton,
  cancelButton,
}: Props) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ color: "white", textAlign: "center" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "white", textAlign: "center" }}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <div className="flex flex-col items-center justify-center space-y-4">
          {actionButton}
          {cancelButton}
        </div>
      </DialogActions>
    </Dialog>
  );
};
