"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4">
      {activitiesJson.map((item, index) => (
        <div
          key={index}
          onClick={() => router.push(item.route)}
          className="mb-4 p-6 border border-black rounded-lg shadow"
        >
          <span className="material-symbols-outlined size-10">{item.icon}</span>
          <a href="#">
            <h5 className="mb-2 text-xl font-semibold tracking-tight text-black">
              {item.title}
            </h5>
          </a>
          <p className="mb-3 font-normal text-black/90 text-sm">
            {item.description}
          </p>
        </div>
      ))}

      {activitiesJson.map((item) => (
        <div
          key={item.title}
          onClick={() => router.push(item.route)}
          className="mb-4 p-6 bg-gray-700 border border-gray-700 rounded-lg shadow"
        >
          <span className="material-symbols-outlined size-10">{item.icon}</span>
          <a href="#">
            <h5 className="mb-2 text-xl font-semibold tracking-tight text-white">
              {item.title}
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-400 text-sm">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

interface dashboardCards {
  title: string;
  description: string;
  route: string;
  icon: string;
}

const activitiesJson: dashboardCards[] = [
  {
    title: "View Volunteer Applications",
    description:
      "Access volunteer applications to review their details, approve or reject submissions.",
    route: "/admin/applications",
    icon: "group_search",
  },
];
