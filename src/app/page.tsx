"use client";

export default function Home() {
  return (
    <div className="p-4 flex flex-col md:flex-row items-center">
      <div className="w-full flex flex-col items-center">
        {
          // Hero section
          <div className="mt-14 mb-12 w-[75%] flex flex-col items-center">
            <img
              src="/images/devfest_vizag_headlock.svg"
              className="w-full mb-4"
            />
            <p>
              GITAM University | <span className="font-bold">December 6-7</span>
            </p>
          </div>
        }
        {
          //CTA
          <div className="w-full flex justify-evenly">
            <button className="font-medium px-7 text-[14px] py-[10px] border-[rgb(var(--md-sys-color-on-surface))] border-2 rounded-full">
              Coming soon...
            </button>
            <button
              onClick={async () => {
                alert("Check back soon.. !!!");
                // if (auth.currentUser) {
                //   router.push("/volunteering");
                //   return;
                // }
                // const userCredential = await signInWithPopup(
                //   auth,
                //   new GoogleAuthProvider()
                // );
                // if (userCredential.user != null) {
                //   router.push("/volunteering");
                // }
              }}
              className="font-medium px-7 text-[14px] py-[10px] text-black border-[rgb(var(--md-sys-color-on-surface))] border-2 bg-[#F9AB00] rounded-full"
            >
              Apply to be a volunteer
            </button>
          </div>
        }
      </div>
      {
        // Gallery
        <div className="my-4">
          <div className="aspect-[1.225] w-full object-cover overflow-clip rounded-3xl border-2 border-[rgb(var(--md-sys-color-on-surface))]">
            <img
              src="/images/devfest19.png"
              className="aspect-[1.225] w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 my-4 gap-4 w-full">
            <img
              src="/images/volunteers.jpg"
              className="aspect-[1.67] grow object-cover rounded-xl border-2 border-[rgb(var(--md-sys-color-on-surface))] saturate-0"
            />
            <img
              src="/images/devfest19.png"
              className="aspect-[1.67] grow object-cover rounded-xl border-2 border-[rgb(var(--md-sys-color-on-surface))] saturate-0"
            />
          </div>
        </div>
      }
    </div>
  );
}
