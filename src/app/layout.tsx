import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={`antialiased flex flex-col`}>
        <nav className="p-6 flex justify-between items-center">
          <img src="/logos/gdg_logo.svg" className="h-8" />
          <img
            src="https://github.com/ManasMalla.png"
            className="size-12 rounded-full object-cover border-black border-[2px]"
          />
        </nav>
        {children}
        <div className="h-24" />
        <div className="fixed bottom-0 h-[90px] flex items-center bg-white shadow-2xl w-full">
          <div className="grow cursor-pointer flex flex-col gap-2 items-center text-blue-500">
            <span className="material-symbols-outlined">home</span>
            <p>Home</p>
          </div>
          <div className="grow cursor-pointer flex flex-col gap-2 items-center">
            <span className="material-symbols-outlined">info</span>
            <p>TBA</p>
          </div>

          <div className="grow cursor-pointer flex flex-col gap-2 items-center">
            <span className="material-symbols-outlined">info</span>
            <p>TBA</p>
          </div>
        </div>
      </body>
    </html>
  );
}
