import { StaticImageData } from "next/image";

export interface Action {
  contactId: string;
  contactFirstName: string;
  contactLastName: string;
  days: number;
  description: string;
  goalDays: number;
  title?: string;
  isNewUser: boolean;
}

export enum ActionType {
  Priority = "priority",
  Upcoming = "upcoming",
}

export interface Contact {
  id: string;
  type: ActionType;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  goalDays: number;
  linkedIn: string;
  email: string;
  phone: string;
  links: string[];
  interests: string[];
  history: string;
  activities: Activity[];
  isArchived: boolean;
}

export interface Activity {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  note: string;
  date: string;
  type: ActivityType;
  contactId: string;
}

export interface ContactArgs {
  id: string;
  isArchived?: boolean;
}

export interface ActivityArgs {
  id?: string;
  contactId?: string;
  title?: string;
  description?: string;
  date?: string;
  type?: ActivityType;
}

export enum ActivityType {
  User = "USER",
  System = "SYSTEM",
}

export interface GoalsArgs {
  goalConnections: number;
  goalMessages: number;
}

export enum SearchParams {
  UserEmail = "user_email",
  Email = "email",
  Name = "name",
  IsChanged = "is_changed",
  RedirectPath = "redirect_path",
  Title = "title",
  Date = "date",
  Description = "description",
  IsFromMessage = "is_from_message",
  IsFromProfile = "is_from_profile",
  IsFromSettings = "is_from_settings",
  IsFromDashboard = "is_from_dashboard",
  Endpoint = "endpoint",
}

export interface SubscriptionArgs {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface NotificationSettingsArgs {
  newAction: boolean;
  streak: boolean;
  meetGoal: boolean;
  subscriptionId: string;
}

export interface Slide {
  id: string;
  title: string;
  description: string;
  image: StaticImageData;
}

export enum TutorialType {
  Dashboard = "dashboard",
  Contacts = "contacts",
  Profile = "profile",
}

export interface TutorialArgs {
  type: TutorialType;
  status: string;
}
