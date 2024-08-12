import { usePathname } from "next/navigation";

import SignOutButton from "./sign-out-button";
import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <div className="flex flex-col items-center justify-center py-5">
      <h1 className="text-5xl pb-5">Sxnics</h1>
      <NavLinks />
      <SignOutButton />
    </div>
  );
}
