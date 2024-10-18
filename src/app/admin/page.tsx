"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { OutlinedTextField, FilledButton } from "material-you-react";

type adminLoginProps = {
  email: string;
  password: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<adminLoginProps>({
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name as keyof adminLoginProps]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.email === "manasmalla.dev@gmail.com" &&
      formData.password === "manasmalla"
    ) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <p className="text-2xl font-sans text-center mb-4 font-semibold">
        Admin Login 🔐
      </p>
      <form onSubmit={handleSubmit} className="w-full mx-auto p-4">
        <div className="mb-5">
          <OutlinedTextField
            value={(formData.email as string) || ""}
            onValueChange={(e) => handleChange("email", e)}
            labelText={"Email"}
          />
        </div>
        <div className="mb-5">
          <OutlinedTextField
            value={(formData.password as string) || ""}
            onValueChange={(e) => handleChange("password", e)}
            labelText={"Password"}
          />
        </div>
        <FilledButton>Login</FilledButton>
      </form>
    </div>
  );
}
