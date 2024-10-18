"use client";
import { auth } from "@/lib/firebase";
import formFields from "@/lib/data/RegDetails";
import { ChangeEvent, FormEvent, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Checkbox, FilledButton, OutlinedTextField, RadioGroup } from "material-you-react";

export type FormDataProps = {
  name: string;
  gender: "He/Him" | "She/Her" | "They/Them" | "Other" | "Prefer not to say";
  phoneNumber: string;
  role: string[];
  organization: string;
  city: string;
  profilePicture: File | null;
  gdgDevLink: string;
  volunteerExperience: string;
  resume: File | null;
  volunteeringInterest: string;
  pastEvents: "Yes" | "No";
  applicationStatus: "processing" | "approved" | "rejected";
  domains: string[];
};


export default function page() {
  const router = useRouter();
  const userId = auth?.currentUser?.uid || "";
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    gender: "Prefer not to say",
    phoneNumber: "",
    role: [],
    organization: "",
    city: "",
    profilePicture: null,
    gdgDevLink: "",
    volunteerExperience: "",
    resume: null,
    volunteeringInterest: "",
    pastEvents: "No",
    applicationStatus: "processing",
    domains: [],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userRef = doc(collection(db, "users"), userId);

    try {
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        if (userData.registration) {
          toast.error("Registration with this email already exists.");
          return;
        }
      }
      await toast.promise(
        setDoc(
          userRef,
          {
            registrationDetails: formData,
            registration: true,
            name: auth.currentUser?.displayName,
            email: auth.currentUser?.email,
          },
          { merge: true }
        ),
        {
          loading: "Submitting Registration...",
          success: "Registration Successful",
          error: "Please try again!",
        }
      );

      // send form to user's email
      const email = ""; // TODO item;
      console.log("Sending POST request to /api/volunteer/sendForm...");
      const emailRes = await axios.post("/api/volunteer/sendForm", {
        email,
        data: formData,
      });
      console.log("Response:", emailRes);
      if (emailRes.status === 200) {
        toast("Confirmation email sent!", { icon: "📩" });
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      router.push("/volunteering");
    }
  };

  const handleChange = (name: string, value: string) => {
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
          {/* <span className="font-mono text-xl">{domains}</span> */}
        </h5>

        <div className="flex flex-col justify-center items-center">
          {/*  Form */}
          <form className="w-[80%]" onSubmit={handleSubmit}>
            {formFields.map((item, index) => (
              <div key={index} className="mb-5">
                {item.type === 'text' || item.type === 'tel' || item.type === 'textarea' ?
                  <OutlinedTextField
                    key={index}
                    value={
                      (formData[item.name as keyof FormDataProps] as string) || ""
                    }
                    onValueChange={(e) => handleChange(item.name, e)}
                    labelText={item.label}
                  />
                  :
                  item.type === 'radio' ?
                    <div>
                      <p>{item.label}</p>
                      <RadioGroup children={item.options || []} value={''} onChange={() => { }} />
                    </div>
                    :
                    item.type === 'checkbox' ?
                      <div className="">
                        <p>{item.label}</p>
                        <div className={item.name === 'domains' ? "grid grid-cols-2 md:grid-cols-3" : ''}>
                          {
                            item.options?.map((op, index) => (
                              <div key={index} className="flex justify-start items-center gap-2">
                                <Checkbox disabled={formData.domains.length >= 3 || formData.domains.includes(op)} value={false} onChange={() => {}} />
                                <p>{op}</p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      :
                      item.type === 'file' ?
                        <div>
                          <p className="mb-2">{item.label}</p>
                          <input type="file" id={item.name} name={item.name} />
                          {
                            item.name === 'profilePicture' && <img src="https://github.com/ChandanKhamitkar.png" alt="Profile Pic" className="size-28 rounded-full m-4" />
                          }
                        </div>
                        :
                        <div className="">
                          <p>{item.label}</p>
                        </div>
                }
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
