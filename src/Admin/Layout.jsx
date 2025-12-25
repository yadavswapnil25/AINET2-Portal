import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sticky Sidebar */}
            <div className="lg:sticky lg:top-0 lg:h-screen lg:z-30">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 w-full">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow">
                                AI
                            </div>
                            <span className="font-semibold text-lg text-gray-900">AINET</span>
                        </div>
                    </div>
                </div>
                
                {/* Content Container */}
                <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
                    <div className="w-full max-w-full">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)] w-full max-w-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
