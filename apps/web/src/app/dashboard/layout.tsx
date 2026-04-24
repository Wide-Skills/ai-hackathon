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
      <div className="flex min-h-screen w-full bg-secondary/10">
        <AppSidebar />
        <SidebarInset className="flex flex-col bg-transparent">
          <Header />
          <main className="flex-1 px-8 py-10 lg:px-12">
            <div className="mx-auto w-full">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
