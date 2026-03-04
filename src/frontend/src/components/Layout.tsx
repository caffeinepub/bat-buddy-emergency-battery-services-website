import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Outlet />
    </div>
  );
}
