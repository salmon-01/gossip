import NavBar from '../components/NavBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {children}
      <NavBar />
    </div>
  );
}
