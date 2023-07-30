import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <div className="p-6">
      <Outlet />
    </div>
  );
}
