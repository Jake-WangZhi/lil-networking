import { parseISO, format, formatISO } from "date-fns";
import validator from "validator";

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

export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (response.ok) return response.json();
    else throw new Error(response.statusText);
  });

export const formatDate = (dateStr: string) => {
  const parsedDate = parseISO(dateStr);
  const formattedDate = format(parsedDate, "MMM d, yyyy");

  return formattedDate;
};

export const formatTitles = (titles: string[]) => {
  return titles
    .join(titles.length === 2 ? " and " : ", ")
    .replace(/,([^,]*)$/, ", and$1");
};

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const convertToLocalizedISODate = (date: string) => {
  const localizedDate = parseISO(date);
  const localizedISODate = formatISO(localizedDate);

  return localizedISODate;
};

export const formatBaseUrl = (url: string) => {
  let formattedUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, ""); //Remove "http://" or "https://" and  "www" prefix

  const index = formattedUrl.indexOf("/");
  if (index !== -1) {
    formattedUrl = formattedUrl.slice(0, index); //Remove everything after the first "/"
  }

  return formattedUrl;
};


export const getVisibleWidth = (windowWidth: number) => {
  if (windowWidth >= 1024) {
    return 768;
  } else if (windowWidth >= 768) {
    return 576;
  } else {
    return windowWidth;
  }
};