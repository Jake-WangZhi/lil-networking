"use client";

import { ActivityType, SearchParams } from "@/types";
import { Typography, Grid } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useCallback, useRef, useEffect } from "react";
import { AlertTriangle } from "react-feather";
import { createActivity } from "@/app/_actions";
import { Button } from "@/components/Button";
import { useActivityMutation } from "@/hooks/useActivityMutation";
import { convertToLocalizedISODate, pauseFor } from "@/lib/utils";

import "../../../styles.css";

const NOTE_CHARACTER_LIMIT = 100;
const DESCRIPTION_CHARACTER_LIMIT = 300;

export default function CreateActivityPage({
  params,
}: {
  params: { contactId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submitFormRef = useRef<HTMLButtonElement>(null);

  const prefilledTitle = searchParams?.get(SearchParams.Title) || "";
  const prefilledDate = searchParams?.get(SearchParams.Date) || "";
  const prefilledDescription =
    searchParams?.get(SearchParams.Description) || "";
  const isFromMessage = searchParams?.get(SearchParams.IsFromMessage) || "";
  const isFromProfile = searchParams?.get(SearchParams.IsFromProfile) || "";
  const isFromDashboard = searchParams?.get(SearchParams.IsFromDashboard) || "";

  const [description, setDescription] = useState(prefilledDescription);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState(prefilledTitle);
  const [date, setDate] = useState(
    prefilledDate || new Date().toISOString().slice(0, 10)
  );
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [localizedISODate, setlocalizedISODate] = useState("");
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  useEffect(() => {
    if (date) {
      const localizedISODate = convertToLocalizedISODate(date);

      setlocalizedISODate(localizedISODate);
    }
  }, [date]);

  const postActivityMutation = useActivityMutation({
    method: "POST",
    onSuccess: ({ showQuote }) => {
      setErrorMessage("");
      const redirectPath = SearchParams.RedirectPath;
      const destinationPath = isFromProfile ? "/contacts" : "/dashboard";

      const path = showQuote
        ? `/quote?${redirectPath}=${destinationPath}`
        : destinationPath;
      router.push(path);
    },
    onError: (error) => {
      setErrorMessage(
        "An error occurred. Cannot submit the form. Please try again."
      );
      console.log(error);
    },
  });

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const validateFields = useCallback(() => {
    setIsSaving(true);
    let hasError = false;

    setTitleError("");
    setDateError("");

    if (!title) {
      setTitleError("Required Field");
      hasError = true;
    }

    if (!date) {
      setDateError("Invalid Date");
      hasError = true;
    }

    if (!hasError) {
      setIsNavigatingBack(true);
      pauseFor(500).then(() => submitFormRef.current?.click());
    } else {
      setIsSaving(false);
    }
  }, [date, title]);

  const handleBackClick = useCallback(() => {
    setIsNavigatingBack(true);
    pauseFor(500).then(() => {
      if (isFromMessage) {
        const localizedISODate = convertToLocalizedISODate(date);

        postActivityMutation.mutate({
          title: prefilledTitle,
          date: localizedISODate,
          description: prefilledDescription,
          contactId: params.contactId,
          type: ActivityType.User,
        });
      } else {
        router.back();
      }
    });
  }, [
    date,
    isFromMessage,
    params.contactId,
    postActivityMutation,
    prefilledDescription,
    prefilledTitle,
    router,
  ]);

  return (
    <main className="relative flex flex-col items-center text-white px-4 pb-8">
      {/* @ts-expect-error Async Server Component */}
      <form action={createActivity}>
        <div
          className={`${
            isNavigatingBack
              ? "animate-slide-out-bottom"
              : "animate-slide-in-bottom"
          }`}
        >
          <div className="flex items-center sticky top-0 w-full bg-dark-blue z-10 pt-8 mb-6">
            <Grid container alignItems="center">
              <Grid item xs={2}>
                <Button
                  variant="text"
                  onClick={handleBackClick}
                  sx={{ px: "14px", ml: "-14px" }}
                >
                  <Typography variant="subtitle1">Cancel</Typography>
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Add Activity
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  variant="text"
                  onClick={validateFields}
                  sx={{
                    color: "#38ACE2",
                    fontSize: "16px",
                    fontWeight: 400,
                    px: "14px",
                    mr: "-14px",
                    "&:hover": {
                      color: "#38ACE2",
                    },
                    "@media (min-width: 768px)": {
                      fontSize: "18px",
                    },
                    "@media (min-width: 1024px)": {
                      fontSize: "20px",
                    },
                    "&:disabled": {
                      color: "#38ACE2",
                    },
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Grid container alignItems="center" rowSpacing={"4px"}>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">Title *</Typography>
                </Grid>
                <Grid item xs={9}>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    placeholder="Add title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>

                <Grid item xs={3} />
                <Grid item xs={9}>
                  {titleError && (
                    <div className=" flex items-center space-x-1">
                      <AlertTriangle
                        size={16}
                        fill="#FB5913"
                        color="black"
                        className="md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <Typography variant="subtitle2">{titleError}</Typography>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container alignItems="center" rowSpacing={"4px"}>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">Date *</Typography>
                </Grid>
                <Grid item xs={9}>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      colorScheme: "dark",
                    }}
                  />
                </Grid>

                <Grid item xs={3} />
                <Grid item xs={9}>
                  {dateError && (
                    <div className=" flex items-center space-x-1">
                      <AlertTriangle
                        size={16}
                        fill="#FB5913"
                        color="black"
                        className="md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <Typography variant="subtitle2">{dateError}</Typography>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: "8px" }}>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                Note
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <textarea
                id="note"
                name="note"
                value={note}
                onChange={handleNoteChange}
                placeholder="Add a note..."
                maxLength={NOTE_CHARACTER_LIMIT}
                className="text-base rounded-[4px] block p-2.5 w-full h-56 bg-white bg-opacity-5 placeholder-gray-400 text-white md:text-lg lg:text-xl focus:ring-1 focus:ring-white focus:bg-white focus:bg-opacity-[0.12] outline-none appearance-none caret-white"
              />
            </Grid>
            <Grid item xs={12} className="relative -mt-2 flex justify-end">
              <Typography variant="body1">
                {note.length}/{NOTE_CHARACTER_LIMIT}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ mt: "8px" }}>
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                Extra Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add any extra activity details here..."
                maxLength={DESCRIPTION_CHARACTER_LIMIT}
                className="text-base rounded-[4px] block p-2.5 w-full h-56 bg-white bg-opacity-5 placeholder-gray-400 text-white md:text-lg lg:text-xl focus:ring-1 focus:ring-white focus:bg-white focus:bg-opacity-[0.12] outline-none appearance-none caret-white"
              />
            </Grid>
            <Grid item xs={12} className="relative -mt-2 flex justify-end">
              <Typography variant="body1">
                {description.length}/{DESCRIPTION_CHARACTER_LIMIT}
              </Typography>
            </Grid>
          </Grid>

          <input
            id="contactId"
            name="contactId"
            type="hidden"
            defaultValue={params.contactId}
          />
          <input
            id="isFromMessage"
            name="isFromMessage"
            type="hidden"
            defaultValue={isFromMessage}
          />
          <input
            id="isFromProfile"
            name="isFromProfile"
            type="hidden"
            defaultValue={isFromProfile}
          />
          <input
            id="isFromDashboard"
            name="isFromDashboard"
            type="hidden"
            defaultValue={isFromDashboard}
          />
          <input
            id="localizedISODate"
            name="localizedISODate"
            type="hidden"
            defaultValue={localizedISODate}
          />
          <button ref={submitFormRef} className="hidden" type="submit"></button>
        </div>
      </form>

      {errorMessage && (
        <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
    </main>
  );
}
