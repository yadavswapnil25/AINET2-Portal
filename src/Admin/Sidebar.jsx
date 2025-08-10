import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  LayoutDashboard,
  X,
  LogOut,
  Newspaper,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IoHome } from "react-icons/io5";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: Users, 
      label: 'User Management', 
      subItems: [
        { label: 'All Users', path: '/admin/users' },
      ] 
    },
    { 
      icon: IoHome, 
      label: 'Home Page', 
      subItems: [
        { label: 'Highlights', path: '/admin/highlights' },
        { label: 'Events', path: '/admin/events' },
        { label: 'Partners', path: '/admin/partners' },
        { label: 'Gallery', path: '/admin/gallery' },
        { label: 'Archives', path: '/admin/archives' },
      ] 
    },
    { 
      icon: IoHome, 
      label: 'About Page', 
      subItems: [
        { label: 'News', path: '/admin/news' },
      
      ] 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      subItems: [
        { label: 'General', path: '/admin/settings' },
        { label: 'Profile', path: '/admin/settings/profile' },
      ] 
    },
  ];

  // Auto-open dropdown if current path belongs to a subItem
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some(sub => location.pathname === sub.path);
        if (hasActiveSub) {
          setOpenDropdown(item.label);
        }
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-base shadow">
             AI
            </div>
            <span className="font-semibold text-lg">AINET</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-700 rounded"
          >
            <X size={16} />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const hasActiveSub = item.subItems?.some(sub => location.pathname === sub.path);
            const isDropdownOpen = openDropdown === item.label;

            if (item.subItems) {
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`
                      flex items-center justify-between cursor-pointer w-full px-4 py-3 text-sm font-medium transition-colors duration-200
                      ${(isDropdownOpen || hasActiveSub)
                        ? 'bg-slate-700 text-teal-400 border-r-2 border-teal-400' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3" size={18} />
                      {item.label}
                    </div>
                    {isDropdownOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="pl-10 bg-slate-700">
                      {item.subItems.map((sub, subIndex) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={subIndex}
                            to={sub.path}
                            onClick={onClose}
                            className={`
                              block py-2 text-sm transition-colors duration-200
                              ${isSubActive 
                                ? 'text-teal-400 font-semibold' 
                                : 'text-slate-300 hover:text-white'}
                            `}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-slate-700 text-teal-400 border-r-2 border-teal-400' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
              >
                <item.icon className="mr-3" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <button 
            onClick={() => {
              // Clear any stored authentication data
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              // Redirect to login page
              window.location.href = '/admin/login';
            }}
            className="flex items-center text-slate-300 hover:text-white text-sm font-medium w-full hover:bg-slate-700 p-2 rounded transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
