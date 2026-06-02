import { Outlet } from "react-router-dom"
import AdminHeader from "./Header"
import AdminSidebar from "./Sidebar"
import { useState } from "react"

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
        {/* Admin sidebar */}
        <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className="flex flex-col flex-1 ">
            {/* Admin header */}
            <AdminHeader setOpen={setOpenSidebar} />
            <main className="flex-1 bg-muted/40 p-4 md:p6 ">
            <Outlet />
            </main>

        </div>
        
    </div>
  )
}

export default AdminLayout