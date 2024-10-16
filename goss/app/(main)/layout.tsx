import NavBar from '../ui/NavBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-darkModePrimaryBackground min-h-screen bg-white text-black ">
      {children}
    </div>
  );
}
