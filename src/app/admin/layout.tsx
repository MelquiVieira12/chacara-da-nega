import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-6">
      <AdminNav />
      {children}
    </div>
  );
}
