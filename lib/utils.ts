import { formatDistanceToNow } from "date-fns";
/* @ts-expect-error Server Component */
import validator from "validator";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  const formattedTimeDiff = formatDistanceToNow(timestamp, { addSuffix: true });

  return formattedTimeDiff;
};

export const classNames = (...classes: (false | null | undefined | string)[]) =>
  classes.filter(Boolean).join(" ");

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return "";
};

export const validateEmail = (email: string) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
};

export const validatePhone = (phone: string) => {
  if (
    !validator.isLength(phone, { min: 10, max: 10 }) ||
    !validator.isMobilePhone(phone, "en-US")
  ) {
    throw new Error("Invalid phone number");
  }
};
