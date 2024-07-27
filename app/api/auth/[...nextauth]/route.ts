import NextAuth, { AuthOptions } from "next-auth";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";
import GoogleProvider from "next-auth/providers/google";
import prisma from "~/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    LinkedInProvider({
      clientId: String(process.env.LINKEDIN_CLIENT_ID),
      clientSecret: String(process.env.LINKEDIN_CLIENT_SECRET),
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile: LinkedInProfile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_ID),
      clientSecret: String(process.env.GOOGLE_SECRET),
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    newUser: "/onboarding",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };