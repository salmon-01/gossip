import NavBar from '../ui/NavBar';
import NavBarWrapper from '../ui/NavBarWrapper';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 text-black">
      {children}
      {/* <NavBarWrapper /> */}
      <NavBar />
    </div>
  );
}
