"use client";

import "../../styles.css";

import ActivityForm from "@/components/profile/ActivityForm";

export default function CreateActivityPage({
  params,
}: {
  params: { contactId: string };
}) {
  return <ActivityForm contactId={params.contactId} />;
}
