import { MdAdminPanelSettings } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { adminSideBarMenuItems } from "../../config";

function MenuItems({setOpen}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSideBarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;
        const isActive = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => { navigate(menuItem.path); if (setOpen) setOpen(false)}}
            className={`flex items-center gap-2 cursor-pointer ${isActive ? "bg-blue-500 text-white p-3 rounded-md" : "hover:bg-gray-200 p-3 rounded-md"}`}
          >
            <Icon className="text-xl" />
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <aside
      className={` fixed top-0 left-0 h-full w-64 flex flex-col border-r-2 border-r-gray-100 bg-white p-6 transition-transform duration-300 z-50
${open ? "translate-x-0" : "-translate-x-full"} 
md:translate-x-0 md:static`}
    >
      <div
        onClick={() => navigate("/admin/dashboard")}
        className=" flex items-center"
      >
        <MdAdminPanelSettings className="" size={30} />
        <h1 className="font-semibold">Admin Panel</h1>
        <button className="border border-gray-400 rounded-xl text-red-500 absolute top-2 right-2 text-lg lg:hidden px-2" onClick={() => setOpen(false)}>X</button>
      </div>
      <MenuItems setOpen={setOpen} />
    </aside>
  );
}

export default AdminSidebar;
