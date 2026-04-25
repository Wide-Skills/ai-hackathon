import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import Header from "@/components/layouts/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-bg">
        <AppSidebar />
        <SidebarInset className="flex flex-col bg-bg">
          <Header />
          <main className="flex-1 px-4 py-comfortable sm:px-6 lg:px-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
