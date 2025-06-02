import React, { useEffect, useState } from "react";
import { Sidebar, Tooltip } from "flowbite-react";
import {
  HiChartPie,
  HiTable,
  HiUser,
  HiPlus,
  HiCog,
  HiViewList,
} from "react-icons/hi";
import type { User } from "../utils/type";
import { SideBarTheme } from "../utils/theme";

type ExcludedType = Omit<User, "password">;

export default function AdminSidebar({ user }: { user?: ExcludedType }) {
  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("activeItem") || "/admin"
  );

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  return (
    <Sidebar
      aria-label="Admin Panel"
      className="basis-[20%] h-screen"
      theme={SideBarTheme}
    >
      <Sidebar.Items className="h-full grid grid-rows-2">
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/admin"
            icon={HiChartPie}
            className={activeItem === "/admin" ? "bg-gray-700" : ""}
            onClick={() => setActiveItem("/admin")}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/create"
            icon={HiPlus}
            className={activeItem === "/admin/create" ? "bg-gray-700" : ""}
            onClick={() => setActiveItem("/admin/create")}
          >
            Create Bus
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/buses"
            icon={HiViewList}
            className={activeItem === "/admin/buses" ? "bg-gray-700" : ""}
            onClick={() => setActiveItem("/admin/buses")}
          >
            Buses
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/drivers"
            icon={HiUser}
            className={activeItem === "/admin/drivers" ? "bg-gray-700" : ""}
            onClick={() => setActiveItem("/admin/drivers")}
          >
            Drivers
          </Sidebar.Item>
          <Sidebar.Item icon={HiTable}>
            <form
              method="post"
              action="/api/user/signout"
              className="cursor-pointer"
            >
              <input type="submit" value="Log out" />
            </form>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="flex items-end mb-8 ml-3">
          <Tooltip
            className="pt-4 w-[200px]"
            trigger="click"
            content={
              <div>
                <p>{user?.username}</p>
                <p className="mt-2 mb-3">{user?.email}</p>
                <hr className="mb-3" />
                <Sidebar.Item
                  href="/admin/settings"
                  icon={HiCog}
                  className={activeItem === "/admin" ? "bg-gray-700" : ""}
                  onClick={() => setActiveItem("/admin")}
                >
                  Settings
                </Sidebar.Item>
              </div>
            }
          >
            <div className="cursor-pointer flex items-center mt-4">
              <div className="bg-white w-20 h-20 rounded-full text-blue-900 text-center text-xs font-bold leading-[80px] uppercase mr-3">
                {user?.cooperativeName}
              </div>
              <div className="text-white">My account</div>
            </div>
          </Tooltip>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
