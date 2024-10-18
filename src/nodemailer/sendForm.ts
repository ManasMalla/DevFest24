// import nodeMailer from "nodemailer";
// import mailgen from "mailgen";
// import dotevn from "dotenv";
// import { FormDataProps } from "@/app/registration/page";
// dotevn.config();

// export default async function sendForm(email: string, data: FormDataProps) {
//   try {
//     const cred = {
//       service: "gmail",
//       auth: {
//         user: process.env.SENDER_MAIL,
//         pass: process.env.SENDER_PASS
//       }
//     }

//     let transporter = nodeMailer.createTransport(cred);

//     let MailGenerator = new mailgen({
//       theme: "salted",
//       product: {
//         name: "Devfest By Google - 2024",
//         link: "https://mailgen.js"
//       }
//     })

//     let response = {
//       body: {
//         name: "Devfest-2024 Volunteer Application",
//         intro: "Thank you for your submission! Here are the details you provided:",
//         table: {
//           data: [
//             { item: "Phone Number", value: data.phoneNumber },
//             { item: "Experience", value: data.volunteerExperience },
//             { item: "Skills/Talents", value: data.skillsOrTalents },
//             { item: "Interest Area", value: data.volunteeringInterest },
//             { item: "Expected Outcome", value: data.expectedOutcome },
//             { item: "Application Status", value: data.applicationStatus },
//           ],
//         },
//         outro: "We will review your application and get back to you soon. Thank you for your interest!"
//       }
//     }

//     let mail = MailGenerator.generate(response);

//     let message = {
//       from: process.env.SENDER_MAIL,
//       to: email,
//       subject: "Devfest-2024 Form Submission",
//       html: mail
//     }

//     await transporter.sendMail(message)
//     console.log("Email sent successfully.");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }

// };