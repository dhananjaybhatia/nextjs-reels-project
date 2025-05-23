
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // ▼▼▼ ADD YOUR DEBUG CODE HERE ▼▼▼
                console.log('Credentials received:', credentials);

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    await connectToDatabase();

                    const user = await UserModel.findOne({ email: credentials.email })
                        .select('+password'); // Important!
                    console.log('User found:', user);

                    if (!user) {
                        console.log('No user found');
                        throw new Error("Invalid credentials");
                    }

                    console.log('Comparing passwords:', {
                        inputPassword: credentials.password,
                        storedHash: user.password
                    });

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    console.log('Password match result:', isValid);

                    if (!isValid) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw error;
                }
                // ▲▲▲ END OF DEBUG CODE ▲▲▲
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};