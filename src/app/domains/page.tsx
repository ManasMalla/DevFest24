"use client";

import { useRouter } from "next/navigation";

// react-icons
import { FaReact, FaCloud } from "react-icons/fa6";
import { FaAppStoreIos } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";

export default function DomainsPage() {
  const router = useRouter();
  return (
    <div
      className="w-full h-screen border bg-gray-800 
        border-gray-700 flex flex-col justify-center items-center"
    >
      <div className="w-full p-4">
        <h5 className="mb-3 text-center text-2xl font-semibold text-white">
          Choose you Domain 🎯
        </h5>
        <p className="text-sm font-normal text-gray-400 text-center">
          Be a part of the fabulous event.
        </p>

        <ul className="my-4 space-y-3">
          {DomainsList.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                router.push(`registration/${item.domain}`);
              }}
              className="flex items-center p-3 text-base font-bold rounded-lg group hover:shadow bg-gray-600 hover:bg-gray-500 text-white cursor-pointer"
            >
              {item.icon}
              <span className="flex-1 ms-3 whitespace-nowrap">
                {item.domain}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const DomainsList = [
  {
    domain: "Web",
    icon: <FaReact />,
  },
  {
    domain: "App Dev",
    icon: <FaAppStoreIos />,
  },
  {
    domain: "Cloud",
    icon: <FaCloud />,
  },
  {
    domain: "AI",
    icon: <RiRobot2Fill />,
  },
];
