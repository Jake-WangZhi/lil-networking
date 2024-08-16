"use client";

import "../../../styles.css";

import ActivityForm from "@/components/ActivityForm";

export default function CreateActivityPage({
  params,
}: {
  params: { contactId: string };
}) {
  return <ActivityForm contactId={params.contactId} />;
}
