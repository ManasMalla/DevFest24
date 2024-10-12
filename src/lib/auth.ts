import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/dist/server/api-utils";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret : process.env.NEXTAUTH_SECRET!,
  callbacks : {
    redirect : ({ url, baseUrl }: any) => {
        return `${baseUrl}/participation`;
    },
    jwt : async ({ user, token }: any) => {
        if(user){
            console.log('ID provided by the user: ', user.id);
            const userRef = doc(db, 'users', user.id); 
            const userData = {
              uid: user.id,
              email: user.email,
              name: user.name,
              registrationDetails: {},
            };
            try {
              await setDoc(userRef, userData, { merge: true });
              token.uid = user.id;
            } catch (error) {
                console.error("Error saving user to Firestore: ", error);
            }
        }
        return token;
    },
    session : async ({ session, token }: any) => {
        if (session.user){
            session.user.id = token.uid;
            console.log('session id : ', session.user.id);
        }
        return session;
    },
  },
  pages: {
    signOut: "/", // Redirect to login page after sign out
  },
};
