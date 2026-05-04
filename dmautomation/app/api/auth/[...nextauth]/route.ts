import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback started for provider:", account?.provider);
      console.log("User email:", user.email);

      if (account?.provider === "google") {
        try {
          const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

          if (fetchError) {
            console.error("Error fetching existing user:", fetchError);
            return false;
          }

          if (!existingUser) {
            console.log("Creating new user in Supabase public.users...");
            const { data: newUser, error: insertError } = await supabaseAdmin
              .from("users")
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  image: (user as any).image || (user as any).picture,
                },
              ])
              .select()
              .single();
            
            if (insertError) {
              console.error("Error creating new user:", insertError);
              return false;
            }
            console.log("New user created successfully:", newUser.id);
            user.id = newUser.id;
          } else {
            console.log("Existing user found:", existingUser.id);
            user.id = existingUser.id;
          }
        } catch (err) {
          console.error("Unexpected error in signIn callback:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
