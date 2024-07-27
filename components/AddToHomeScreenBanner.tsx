import { X, Share } from "react-feather";
import icon from "~/public/icons/icon-512x512.png";
import Image from "next/image";
import { Button } from "./Button";
import { Typography } from "@mui/material";
import { useState, useCallback, useEffect } from "react";

interface Props {
  addBottomPadding: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: OutcomeType;
    platform: string;
  }>;
  prompt(): Promise<void>;
}

enum OutcomeType {
  Accepted = "accepted",
  Dismissed = "dismissed",
}

export const AddToHomeScreenBanner = ({ addBottomPadding }: Props) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const isIOS =
    typeof window !== "undefined"
      ? /iPhone|iPad/.test(window.navigator.userAgent)
      : false;

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    setDeferredPrompt(e as BeforeInstallPromptEvent);
    // Update UI to notify the user they can add to home screen
    setIsModalOpened(true);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [handleBeforeInstallPrompt]);

  useEffect(() => {
    if (isIOS) {
      const isInStandaloneMode = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      if (!isInStandaloneMode) setIsModalOpened(true);
    }
  }, [isIOS]);

  const handleA2HSClick = useCallback(() => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((e) => {
      setDeferredPrompt(null);
      if (e.outcome === OutcomeType.Accepted) {
        setIsModalOpened(false);
      }
    });
  }, [deferredPrompt]);

  const handleClose = useCallback(() => setIsModalOpened(false), []);

  return (
    <>
      {isModalOpened && (
        <div
          className={`fixed bottom-0 left-0 right-0 w-full z-10 mx-auto max-w-lg md:max-w-xl lg:max-w-3xl px-4 py-6 bg-[#2C353E] flex justify-between ${
            addBottomPadding && "mb-14"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Button variant="text" onClick={handleClose}>
              <X
                size={24}
                className="md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0"
              />
            </Button>
            <Image src={icon} height={48} width={48} alt={"icon"} />

            <div className="pl-2">
              {isIOS ? (
                <Typography variant="body1">
                  Install this web app on your iPhone or iPad for the best
                  experience.
                  <span className="flex items-center space-x-1">
                    <span>Tap</span>
                    <Share
                      size={14}
                      className="md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0"
                    />
                    <span>and then &quot;Add to Home Screen&quot;.</span>
                  </span>
                </Typography>
              ) : (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    The Little Networking App
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "white" }}>
                    Add to Home Screen
                  </Typography>
                </>
              )}
            </div>
          </div>
          {!isIOS && (
            <Button
              variant="text"
              onClick={handleA2HSClick}
              sx={{ color: "#38ACE2" }}
            >
              Install
            </Button>
          )}
        </div>
      )}
    </>
  );
};
