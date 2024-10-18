"use client";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import { Scaffold } from "material-you-react";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userImage, setUserImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
  );
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserImage(
        user?.photoURL ??
          "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
      );
    });
  }, [auth.currentUser]);
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`antialiased flex flex-col md:px-12 lg:px-36`}>
        <AuthContextProvider>
          <Scaffold>
            <>
              <nav className="p-6 flex justify-between items-center">
                <a href="/">
                  <img src="/logos/gdg_logo.svg" className="h-8" />
                </a>
                <img
                  referrerPolicy="no-referrer"
                  src={userImage}
                  className="size-12 rounded-full object-cover border-[rgb(var(--md-sys-color-on-surface))] border-[2px]"
                />
              </nav>
              {children}
              {/* <div className="h-24" /> */}
            </>
          </Scaffold>
        </AuthContextProvider>
      </body>
    </html>
  );
}
