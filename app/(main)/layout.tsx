"use client";

import { BackPathContext } from "~/contexts/BackPathContext";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { UserProvider } from "~/contexts/UserContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [backPath, setBackPath] = useState(`/${pathname?.split("/")[1]}`);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.push("/signin");
    return null;
  } else {
    const { name, image, email } = session.user;

    return (
      <section>
        <BackPathContext.Provider value={{ backPath, setBackPath }}>
          <UserProvider user={{ name, image, email }}>{children}</UserProvider>
        </BackPathContext.Provider>
      </section>
    );
  }
}
