import NavBar from '../ui/NavBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 text-black dark:bg-slate-800">
      {children}
      <NavBar />
    </div>
  );
}
