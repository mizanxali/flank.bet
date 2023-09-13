import Navbar from "./Navbar";
import { Inter } from "next/font/google";
import Sidebar from "./Sidebar";

const inter = Inter({ subsets: ["latin"], weight: "400" });

interface Props {
  showSidebar?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ showSidebar, children }) => {
  return (
    <div className={`flex flex-col w-full min-h-screen ${inter.className}`}>
      <Navbar />
      {showSidebar ? (
        <>
          <Sidebar />
          <div className="ml-60 mt-24">{children}</div>
        </>
      ) : (
        <div className="flex-1 flex flex-col mt-24">{children}</div>
      )}
    </div>
  );
};

export default Layout;
