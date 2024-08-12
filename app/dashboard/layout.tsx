import SideNav from "../ui/side-nav";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex h-screen flex-col md:flex-row md:overflow-hidden bg-black text-white ${montserrat.className}`}>
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow m-2.5 md:overflow-y-auto border p-5">
        {children}
      </div>
    </div>
  );
}
