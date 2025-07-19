import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 p-6 overflow-hidden">
                {/* Mobile menu button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                
                <div className="w-full">
                    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-3rem)]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
