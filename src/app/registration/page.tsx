"use client";
import { auth, storage } from "@/lib/firebase";
import formFields from "@/lib/data/RegDetails";
import { FormEvent, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Checkbox,
  FilledButton,
  OutlinedTextField,
  RadioGroup,
} from "material-you-react";
import { useAuthContext } from "../context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type FormDataProps = {
  name: string;
  gender:
  | "He/Him"
  | "She/Her"
  | "They/Them"
  | "Other"
  | "Prefer not to say"
  | "";
  phoneNumber: string;
  role: string;
  organization: string;
  city: string;
  profilePicture: File | null | string;
  gdgDevLink: string;
  volunteerExperience: string;
  resume: File | null | string;
  volunteeringInterest: string;
  pastEvents: "Yes" | "No" | "";
  applicationStatus: "processing" | "approved" | "rejected";
  domains: string[];
};

export default function Page() {
  const router = useRouter();
  const userId = auth?.currentUser?.uid || "";
  const user = useAuthContext();
  useEffect(() => {
    if (user) {
      handleChange("name", user.displayName || "");
    }
  }, [user]);
  const [formData, setFormData] = useState<FormDataProps>({
    name: user?.displayName || "",
    gender: "",
    phoneNumber: "",
    role: "",
    organization: "",
    city: "",
    profilePicture: null,
    gdgDevLink: "",
    volunteerExperience: "",
    resume: null,
    volunteeringInterest: "",
    pastEvents: "",
    applicationStatus: "processing",
    domains: [],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profilePicture = ref(storage, `profilePictures/${userId}.png`);
    const resume = ref(storage, `resumes/${userId}.pdf`);

    if (formData.profilePicture == null || formData.resume == null) {
      toast.error("Please upload profile picture and resume");
      return;
    }
    const snapshot = await uploadBytes(profilePicture, formData.profilePicture as File);
    const snapshotResume = await uploadBytes(resume, formData.resume as File);

    const userRef = doc(collection(db, "users"), userId);

    const completeRegistration = async () => {
      const profileURL = await getDownloadURL(profilePicture);
      const resumeURL = await getDownloadURL(resume);
      console.log("profile URL =",profileURL);
      console.log("Resume URL =",resumeURL);

      setDoc(
        userRef,
        {
          registrationDetails: {
            ...formData,
            profilePicture: profileURL,
            resume: resumeURL
          },
          registration: true,
          email: auth.currentUser?.email,
        },
      );

      await axios.get(`https://us-central1-devfest-2024-64eb1.cloudfunctions.net/volunteerApplicationSubmittedEmail?name=${formData.name}&email=${user?.email}&data=${JSON.stringify(
        {
          ...formData,
          profilePicture: profileURL.split('&token')[0],
          profilePictureToken : profileURL.split('&token')[1],
          resume: resumeURL.split('&token')[0],
          resumeToken : resumeURL.split('&token')[1],
        })}`)
    }

    try {
      await toast.promise(
        completeRegistration(),
        {
          loading: "Submitting Registration...",
          success: "Registration Successful",
          error: "Please try again!",
        }
      );
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      router.push("/volunteering");
    }
  };

  const handleChange = (name: string, value: string | string[] | File) => {
    setFormData({
      ...formData,
      [name as keyof FormDataProps]: value,
    });
  };

  return (
    <div className="w-full min-h-screen h-full flex flex-col justify-start items-center">
      <div className="w-full p-4">
        <h5 className="mb-5 text-center text-2xl font-semibold">
          Fill in your details
        </h5>

        <div className="flex flex-col justify-center items-center">
          {/*  Form */}
          <form className="w-[80%]" onSubmit={handleSubmit}>
            {formFields.map((item, index) => (
              <div key={index} className="mb-5">
                {item.type === "text" ||
                  item.type === "tel" ||
                  item.type === "textarea" ? (
                  <OutlinedTextField
                    key={index}
                    value={
                      (formData[item.name as keyof FormDataProps] as string) ||
                      ""
                    }
                    type={item.type == "textarea" ? "textarea" : ""}
                    onValueChange={(e) => handleChange(item.name, e)}
                    labelText={item.label}
                  />
                ) : item.type === "radio" ? (
                  <div>
                    <p>{item.label}</p>
                    <RadioGroup
                      children={item.options || []}
                      value={
                        (formData[
                          item.name as keyof FormDataProps
                        ] as string) || ""
                      }
                      onChange={(value) => {
                        handleChange(item.name, value);
                      }}
                    />
                  </div>
                ) : item.type === "checkbox" ? (
                  <div className="">
                    <p>{item.label}</p>
                    <div
                      className={
                        item.name === "domains"
                          ? "grid grid-cols-2 md:grid-cols-3"
                          : ""
                      }
                    >
                      {item.options?.map((op, index) => (
                        <div
                          key={index}
                          className="flex justify-start items-center gap-2"
                        >
                          <Checkbox
                            disabled={
                              formData.domains.length >= 3 &&
                              !formData.domains.includes(op)
                            }
                            value={
                              (
                                formData[
                                item.name as keyof FormDataProps
                                ] as string[]
                              ).includes(op) || false
                            }
                            onChange={() => {
                              if (
                                (
                                  formData[
                                  item.name as keyof FormDataProps
                                  ] as string[]
                                ).includes(op)
                              ) {
                                const newDomains = (
                                  formData[
                                  item.name as keyof FormDataProps
                                  ] as string[]
                                ).filter((domain) => domain !== op);
                                handleChange(item.name, newDomains);
                              } else {
                                handleChange(item.name, [
                                  ...(formData[
                                    item.name as keyof FormDataProps
                                  ] as string[]),
                                  op,
                                ]);
                              }
                            }}
                          />
                          <p>{op}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : item.type === "file" ? (
                  <div>
                    <p className="mb-2">{item.label}</p>
                    <input
                      type="file"
                      id={item.name}
                      name={item.name}
                      onChange={(e) => {
                        if (!e.target.files) return;
                        handleChange(item.name, e.target.files[0]);
                      }}
                    />
                    {item.name === "profilePicture" &&
                      formData.profilePicture && (
                        <img
                          src={
                            formData.profilePicture && typeof (formData.profilePicture) !== 'string'
                              ? URL.createObjectURL(formData.profilePicture as File)
                              : typeof (formData.profilePicture) === 'string'
                                ? formData.profilePicture
                                : ''
                          }
                          alt="Profile Pic"
                          className="size-28 rounded-full m-4 object-cover"
                        />
                      )}
                  </div>
                ) : (
                  <div className="">
                    <p>{item.label}</p>
                  </div>
                )}
              </div>
            ))}
            <FilledButton>Submit</FilledButton>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
