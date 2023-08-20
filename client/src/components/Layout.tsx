import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="relative">{children}</div>
    </div>
  );
};

export default Layout;
