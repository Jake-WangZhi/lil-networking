import { ContactArgs } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Args = {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  method: "PUT" | "DELETE";
};

export const useContactMutation = ({ onSuccess, onError, method }: Args) =>
  useMutation({
    mutationFn: async (contactArgs: ContactArgs) => {
      const response = await fetch(`/contacts/${contactArgs.id}/api`, {
        headers: {
          "Content-Type": "application/json",
        },
        ...(method === "DELETE" ? {} : { body: JSON.stringify(contactArgs) }),
        method,
      });

      if (!response.ok) {
        throw new Error("Unable to update");
      }
    },
    onSuccess,
    onError,
  });
