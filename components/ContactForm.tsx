import { Typography, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import validator from "validator";
import { Button } from "./Button";
import { Contact } from "@/types";
import TagsInput from "react-tagsinput";
import { upsertContact } from "@/app/_actions";
import { event } from "nextjs-google-analytics";
import { useUser } from "@/contexts/UserContext";
import { isValidLinkedInUrl } from "@/lib/utils";
import { Warning, PlusCircle } from "@phosphor-icons/react";

interface Props {
  contact?: Contact;
}

export const ContactForm = ({ contact }: Props) => {
  const { email: userEmail } = useUser();
  const router = useRouter();
  const submitFormRef = useRef<HTMLButtonElement>(null);

  const [firstName, setFirstName] = useState(contact?.firstName);
  const [lastName, setLastName] = useState(contact?.lastName);
  const [title, setTitle] = useState(contact?.title);
  const [company, setCompany] = useState(contact?.company);
  const [industry, setIndustry] = useState(contact?.industry);
  const [email, setEmail] = useState(contact?.email);
  const [phone, setPhone] = useState(contact?.phone);
  const [linkedIn, setLinkedIn] = useState(contact?.linkedIn);
  const [links, setLinks] = useState<string[]>(contact?.links ?? []);
  const [selectedGoalDays, setSelectedGoalDays] = useState(
    contact?.goalDays ?? 30
  );
  const [tags, setTags] = useState<string[]>(contact?.interests ?? []);
  const [history, setHistory] = useState(contact?.history);

  const [firstNameError, setFirstNameError] = useState("");
  const [linkedInError, setLinkedInError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [linkError, setLinkError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const adjustHeight = () => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    adjustHeight();

    window.addEventListener("resize", adjustHeight);
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [history]);

  const handleChange = useCallback((tags: string[]) => {
    setTags(tags);
  }, []);

  const handleAddLink = useCallback(() => {
    setLinks((prevLinks) => [...prevLinks, ""]);
  }, []);

  const handleLinkChange = useCallback((index: number, value: string) => {
    setLinks((prevLinks) => {
      const updatedLinks = [...prevLinks];
      updatedLinks[index] = value;
      return updatedLinks;
    });
  }, []);

  const handleDaysClick = useCallback(
    (goalDays: number) => () => {
      setSelectedGoalDays(goalDays);
    },
    []
  );

  const validateFields = useCallback(() => {
    setIsSaving(true);
    let hasError = false;

    setFirstNameError("");
    setEmailError("");
    setPhoneError("");

    if (!firstName) {
      setFirstNameError("Required Field");
      hasError = true;
    }

    if (linkedIn && !isValidLinkedInUrl(linkedIn)) {
      setLinkedInError("Invalid LinkedIn Link");
      hasError = true;
    }

    if (email && !validator.isEmail(email)) {
      setEmailError("Invalid Email");
      hasError = true;
    }

    if (
      phone &&
      (!validator.isLength(phone, { min: 10, max: 10 }) ||
        !validator.isMobilePhone(phone, "en-US"))
    ) {
      setPhoneError("Invalid Phone Number");
      hasError = true;
    }

    if (links.some((link) => link && !validator.isURL(link))) {
      setLinkError("Invalid Link");
      hasError = true;
    }

    if (!hasError) {
      submitFormRef.current?.click();

      !contact && userEmail && event("contact_created", { label: userEmail });
    } else {
      setIsSaving(false);
    }
  }, [firstName, linkedIn, email, phone, links, contact, userEmail]);

  const handleBackClick = useCallback(() => router.back(), [router]);

  useEffect(() => {
    if (firstNameError) {
      firstName && setFirstNameError("");
    }
    if (linkedInError) {
      ((linkedIn && isValidLinkedInUrl(linkedIn)) || !linkedIn) &&
        setLinkedInError("");
    }
    if (emailError) {
      (email && validator.isEmail(email)) || (!email && setEmailError(""));
    }
    if (phoneError) {
      (phone &&
        validator.isLength(phone, { min: 10, max: 10 }) &&
        validator.isMobilePhone(phone, "en-US")) ||
        (!phone && setPhoneError(""));
    }
    if (linkError) {
      links.forEach((link) => {
        if (link && !validator.isURL(link)) {
          setLinkError("Invalid Link");
        }
      });
    }
  }, [
    email,
    emailError,
    firstName,
    firstNameError,
    linkError,
    linkedIn,
    linkedInError,
    links,
    phone,
    phoneError,
  ]);

  return (
    <main className="relative flex flex-col items-center text-white pb-8">
      {/* @ts-expect-error Async Server Component */}
      <form action={upsertContact}>
        <div className="flex items-center sticky top-0 w-full bg-dark-blue z-10 pt-4 mb-6 px-4">
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
                {contact ? "Edit contact" : "Create contact"}
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

        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ px: "16px", pt: "1px" }}
        >
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Primary Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="center" rowSpacing={"4px"}>
              <Grid item xs={3}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    "@media (max-width:380px)": {
                      fontSize: 13,
                    },
                  }}
                >
                  First *
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{ paddingLeft: "4px" }}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    ...(firstNameError && {
                      border: "1px solid #FB5913",
                    }),
                  }}
                />
              </Grid>

              <Grid item xs={3} />
              <Grid item xs={9}>
                {firstNameError && (
                  <div className="mt-1 flex items-center space-x-1">
                    <Warning
                      size={16}
                      fill="#FB5913"
                      className="-mt-0.5 ml-1 md:w-5 md:h-5 lg:w-6 lg:h-6"
                    />
                    <Typography variant="subtitle2">
                      {firstNameError}
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              sx={{
                "@media (max-width:380px)": {
                  fontSize: 13,
                },
              }}
            >
              Last
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              sx={{
                "@media (max-width:380px)": {
                  fontSize: 13,
                },
              }}
            >
              Industry
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <input
              type="text"
              id="industry"
              name="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              sx={{
                "@media (max-width:380px)": {
                  fontSize: 13,
                },
              }}
            >
              Title
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              sx={{
                "@media (max-width:380px)": {
                  fontSize: 13,
                },
              }}
            >
              Company
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <input
              type="text"
              id="company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="subtitle1"
              sx={{
                "@media (max-width:380px)": {
                  fontSize: 13,
                },
              }}
            >
              Reminder
            </Typography>
          </Grid>
          <Grid
            item
            xs={9}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                border: selectedGoalDays === 30 ? "1px solid #38ACE2" : "none",
                color: selectedGoalDays === 30 ? "#38ACE2" : "white",
              }}
              onClick={handleDaysClick(30)}
            >
              30 days
            </Button>
            <Button
              variant="outlined"
              sx={{
                border: selectedGoalDays === 60 ? "1px solid #38ACE2" : "none",
                color: selectedGoalDays === 60 ? "#38ACE2" : "white",
              }}
              onClick={handleDaysClick(60)}
            >
              60 days
            </Button>
            <Button
              variant="outlined"
              sx={{
                border: selectedGoalDays === 90 ? "1px solid #38ACE2" : "none",
                color: selectedGoalDays === 90 ? "#38ACE2" : "white",
              }}
              onClick={handleDaysClick(90)}
            >
              90 days
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 600, mt: "16px" }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="center" rowSpacing={"4px"}>
              <Grid item xs={3}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    "@media (max-width:380px)": {
                      fontSize: 13,
                    },
                  }}
                >
                  LinkedIn
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="text"
                  id="linkedIn"
                  name="linkedIn"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  style={{
                    ...(linkedInError && {
                      border: "1px solid #FB5913",
                    }),
                  }}
                />
              </Grid>

              <Grid item xs={3} />
              <Grid item xs={9}>
                {linkedInError && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Warning
                      size={16}
                      fill="#FB5913"
                      className="-mt-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                    />
                    <Typography variant="subtitle2">{linkedInError}</Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="center" rowSpacing={"4px"}>
              <Grid item xs={3}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    "@media (max-width:380px)": {
                      fontSize: 13,
                    },
                  }}
                >
                  Email
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...(emailError && {
                      border: "1px solid #FB5913",
                    }),
                  }}
                />
              </Grid>

              <Grid item xs={3} />
              <Grid item xs={9}>
                {emailError && (
                  <div className=" flex items-center space-x-1">
                    <Warning
                      size={16}
                      fill="#FB5913"
                      className="-mt-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                    />
                    <Typography variant="subtitle2">{emailError}</Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container alignItems="center" rowSpacing={"4px"}>
              <Grid item xs={3}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    "@media (max-width:380px)": {
                      fontSize: 13,
                    },
                  }}
                >
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  style={{
                    ...(phoneError && {
                      border: "1px solid #FB5913",
                    }),
                  }}
                />
              </Grid>

              <Grid item xs={3} />
              <Grid item xs={9}>
                {phoneError && (
                  <div className="flex items-center space-x-1">
                    <Warning
                      size={16}
                      fill="#FB5913"
                      className="-mt-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                    />
                    <Typography variant="subtitle2">{phoneError}</Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          {links.map((link, index) => (
            <Grid item xs={12} key={`link-${index}`}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      "@media (max-width:380px)": {
                        fontSize: 13,
                      },
                    }}
                  >
                    {`Link ${index + 1}`}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <input
                    type="text"
                    value={link}
                    className="text-base rounded-[4px] block w-full h-12 px-2 py-3 bg-white bg-opacity-5  placeholder-gray-400 text-white md:text-lg lg:text-xl focus:ring-1 focus:ring-white focus:bg-white focus:bg-opacity-[0.12] focus:outline-none appearance-none caret-white"
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    style={{
                      ...(linkError &&
                        link &&
                        !validator.isURL(link) && {
                          border: "1px solid #FB5913",
                        }),
                    }}
                  />
                </Grid>

                <Grid item xs={3} />
                <Grid item xs={9}>
                  {linkError && link && !validator.isURL(link) && (
                    <div className="mt-1 flex items-center space-x-1">
                      <Warning
                        size={16}
                        fill="#FB5913"
                        className="-mt-0.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
                      />
                      <Typography variant="subtitle2">{linkError}</Typography>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} className="flex justify-end relative -mt-2">
            <Button
              variant="text"
              sx={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                px: "8px",
              }}
              onClick={handleAddLink}
            >
              <PlusCircle
                size={24}
                className="mb-1 text-light-blue md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
              <Typography
                variant="subtitle1"
                sx={{ color: "#38ACE2", fontWeight: 600 }}
              >
                Add Link
              </Typography>
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "16px",
              position: "relative",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              Tags
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "-4px" }}>
            <div className="space-y-1">
              <Typography variant="subtitle1">
                Add tags to remember important details
              </Typography>
              <Typography variant="body1">
                Interests, Industries, notes, priorities, etc.
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <TagsInput
              value={tags}
              onChange={handleChange}
              inputProps={{
                id: "tagsInput",
                placeholder: tags.length ? "" : "Type interest here...",
              }}
              focusedClassName="ring-1 ring-white outline-none appearance-none caret-white"
              className="rounded-[4px] block w-full min-h-[64px] h-auto p-2 bg-white bg-opacity-5"
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "16px",
              position: "relative",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              History
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "-4px" }}>
            <div className="space-y-1">
              <Typography variant="subtitle1">How did you meet?</Typography>
              <Typography variant="body1">
                Never forget where you met a contact again.
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <textarea
              id="history"
              name="history"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              ref={textareaRef}
              placeholder="Add where you met here..."
              className="p-2 min-h-[48px] w-full box-border resize-none overflow-hidden"
            />
          </Grid>
        </Grid>

        <input id="id" name="id" type="hidden" defaultValue={contact?.id} />
        <input
          id="userEmail"
          name="userEmail"
          type="hidden"
          defaultValue={userEmail || ""}
        />
        <input id="links" name="links" type="hidden" defaultValue={links} />
        <input
          id="goalDays"
          name="goalDays"
          type="hidden"
          defaultValue={selectedGoalDays}
        />
        <input
          id="interests"
          name="interests"
          type="hidden"
          defaultValue={tags}
        />
        <button ref={submitFormRef} className="hidden" type="submit"></button>
      </form>
    </main>
  );
};
