// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // dùng JWT cho đơn giản
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db(); // dùng database mặc định trong connection string
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        // trả về object user (NextAuth sẽ lưu session)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login", // đường dẫn đến page login của bạn
  },
};

export default authOptions;
