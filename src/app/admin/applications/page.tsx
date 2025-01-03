"use client";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormDataProps } from "@/app/registration/page";
import { formFields } from "@/lib/data/RegDetails";
// import { Toaster } from "react-hot-toast";
import { OutlinedTextField } from "material-you-react";
import { FilledButton } from "material-you-react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const DomainOptions = [
  { value: "All", text: "All" },
  { value: "Web", text: "Web" },
  { value: "AI", text: "AI" },
  { value: "Cloud", text: "Cloud" },
];

type DefaultDetails = {
  email: string;
  name: string;
};

type ApplicationCollection = {
  uid: string;
  registration: boolean;
  registrationDetails: FormDataProps;
} & DefaultDetails;

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const user = useAuthContext();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationCollection | null>(null);
  const [allApplications, setAllApplications] = useState<
    ApplicationCollection[]
  >([]);
  const [filteredApplications, setFilteredApplications] = useState<
    ApplicationCollection[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!user) return;
    if (
      user?.uid != "NmZwEUEvIQbpwJZ1jlrvZ47OH7i1" &&
      user?.uid != "oBYmZwFXDeS0O2uDryFuhw5ujd33"
    ) {
      alert("You are not authorized to view this page");
      router.push("/");
    } else {
      const usersRef = collection(db, "users");
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const retrievedData = snapshot.docs.map(
          (doc) => doc.data() as ApplicationCollection
        );
        setAllApplications(retrievedData);
        setFilteredApplications(retrievedData.slice(0, ITEMS_PER_PAGE));
        setTotalPages(Math.ceil(retrievedData.length / ITEMS_PER_PAGE));
      });

      return () => unsubscribe();
    }
  }, [user]);

  const filterApplications = useCallback(() => {
    const filtered = allApplications.filter((application) => {
      const matchesDomain =
        selectedDomain === "All" ||
        application.registrationDetails.domains.includes(selectedDomain);
      const matchesSearch = application.registrationDetails.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesDomain && matchesSearch;
    });

    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setFilteredApplications(
      filtered.slice(
        (pageNumber - 1) * ITEMS_PER_PAGE,
        pageNumber * ITEMS_PER_PAGE
      )
    );
  }, [allApplications, searchTerm, selectedDomain, pageNumber]);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, selectedDomain, pageNumber, filterApplications]);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const openModal = (application: ApplicationCollection) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
      <div className="overflow-x-hidden shadow-md">
        <div className="flex flex-col sm:flex-row flex-wrap space-y-4 items-center justify-between pb-4">
          <div className="flex gap-2 justify-center items-center">
            <p>Domain:</p>
            <select
              onChange={(e) => setSelectedDomain(e.target.value)}
              id="dropdownRadioButton"
              className="flex items-center justify-between text-black border border-gray-600 focus:outline-none hover:bg-black/10 font-medium rounded-lg text-sm px-3 py-1.5 gap-2 appearance-none cursor-pointer"
            >
              {DomainOptions.map((item, index) => (
                <option
                  key={index}
                  value={item.value}
                  className="text-black px-4 py-2 hover:bg-blue-200 flex justify-between items-center cursor-pointer"
                >
                  {item.text}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <OutlinedTextField
              leadingIcon={"search"}
              labelText={"search"}
              value={searchTerm || ""}
              onValueChange={(e) => {
                setSearchTerm(e);
              }}
            />
          </div>
        </div>
        <table className="w-full overflow-hidden text-sm text-left text-black">
          <thead className="text-xs uppercase bg-gray-200 text-black">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
              <th scope="col" className="px-6 py-3">
                Domain
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-600"
                onClick={() => openModal(item)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap"
                >
                  {item.registrationDetails.name}
                </th>
                <td className="px-6 py-4 max-w-[clamp(150px,30vw,300px)] whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.email}
                </td>
                <td className="px-6 py-4">
                  {item.registrationDetails.domains}
                </td>
                <td
                  className={`x-6 py-4 font-mono ${
                    item.registrationDetails.applicationStatus === "processing"
                      ? "text-yellow-500"
                      : item.registrationDetails.applicationStatus ===
                        "rejected"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.registrationDetails.applicationStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
            Previous
          </button>
          <p>
            Page {pageNumber} of {totalPages}
          </p>
          <button onClick={handleNextPage} disabled={pageNumber === totalPages}>
            Next
          </button>
        </div>
      </div>
      {showModal && selectedApplication && (
        <PopupModal application={selectedApplication} onClose={closeModal} />
      )}
      {/* <Toaster /> */}
    </div>
  );
}

function PopupModal({
  application,
  onClose,
}: {
  application: ApplicationCollection;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const updateApplicationStatus = async (status: string) => {
  //   const userRef = doc(collection(db, "users"), auth.currentUser?.uid || "");
  //   await toast.promise(
  //     updateDoc(userRef, { "registrationDetails.applicationStatus": status }),
  //     {
  //       loading: "Updating please wait!",
  //       success: "Status updated Successfully",
  //       error: "Please try again!",
  //     }
  //   );

  //   onClose();
  // };
  return (
    <div className="fixed inset-0 flex justify-center items-center select-none z-20">
      <div ref={modalRef} className="w-[85%] flex flex-col gap-3 text-white">
        <button onClick={onClose} className="place-self-end">
          <p className="size-10 text-black font-medium">X</p>
        </button>

        <div className="w-full max-h-[500px] overflow-y-scroll py-6 px-4 flex flex-col items-center bg-white rounded-xl space-y-7 border border-gray-400">
          <div className="h-px w-[80%] bg-gray-500 opacity-70" />
          <div className="w-full flex-justify-start items-start gap-5 ">
            <p className="w-full text-base font-medium tracking-wider text-black">
              Email
            </p>
            <p className="w-full text-sm font-normal tracking-wide text-gray-500 text-wrap">
              {application.email}
            </p>
          </div>
          {formFields.map((item, index) => (
            <div
              key={index}
              className="w-full flex-justify-start items-start gap-5 "
            >
              <p className="w-full text-base font-medium tracking-wider text-black">
                {item.label}
              </p>
              {item.name === "resume" ? (
                <a
                  href={`${application?.registrationDetails[
                    item.name as keyof FormDataProps
                  ]?.toString()}`}
                  className="text-blue-500 underline"
                >
                  Click Here
                </a>
              ) : item.name === "profilePicture" ? (
                <img
                  src={`${application?.registrationDetails[
                    item.name as keyof FormDataProps
                  ]?.toString()}`}
                  alt="Profile Pic"
                  className="size-28 rounded-full m-4 object-cover"
                />
              ) : (
                <p className="w-full text-sm font-normal tracking-wide text-gray-500 text-wrap">
                  {application?.registrationDetails[
                    item.name as keyof FormDataProps
                  ]?.toString()}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center gap-6">
          {/* <button
            onClick={() => updateApplicationStatus("approved")}
            type="button"
            className={`focus:outline-none text-white bg-green-600/80 hover:bg-green-700 focus:ring-4 focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${application.registrationDetails.applicationStatus === "approved"
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
          >
            Approve
          </button> */}
          <FilledButton
            onClick={() => {}}
            disabled
            containerColor="rgb(22 163 74)"
          >
            <p>Approve</p>
          </FilledButton>

          <FilledButton
            onClick={() => {}}
            disabled
            containerColor="rgb(220 38 38)"
          >
            <p>Reject</p>
          </FilledButton>

          {/* <button
            onClick={() => updateApplicationStatus("rejected")}
            type="button"
            className={`focus:outline-none text-white bg-red-600/80 hover:bg-red-700 focus:ring-4 focus:ring-red-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${application.registrationDetails.applicationStatus === "rejected"
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
          >
            Reject
          </button> */}
        </div>
      </div>
    </div>
  );
}
