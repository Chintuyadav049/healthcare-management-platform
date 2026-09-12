import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="min-h-screen lg:pl-64">
        <Topbar title={title} subtitle={subtitle} />

        <div className="p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;