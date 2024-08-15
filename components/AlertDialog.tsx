import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  neverShowAgain?: ReactNode;
  actionButton: ReactNode;
  cancelButton: ReactNode;
}

export const AlertDialog = ({
  isOpen,
  setIsOpen,
  title,
  description,
  neverShowAgain,
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
      <DialogTitle id="alert-dialog-title">
        <Typography
          variant="h3"
          sx={{ textAlign: "center", fontWeight: 600, color: "white" }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            {description}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <div>
          <div className="-mt-6 -mb-2">{neverShowAgain}</div>
          <div className="flex flex-col items-center justify-center space-y-4 mt-12">
            {actionButton}
            {cancelButton}
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};
