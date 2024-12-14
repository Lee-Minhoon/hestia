import MainLayoutFooter from "./footer";
import MainLayoutHeader from "./header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainLayoutHeader />
      <div className="flex p-4 flex-1 justify-center">
        <div className="w-content">{children}</div>
      </div>
      <MainLayoutFooter />
    </div>
  );
}
