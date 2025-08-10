import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  LayoutDashboard,
  X,
  LogOut,
  Newspaper,
  GraduationCap,
  Calendar
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: Newspaper, label: 'Publications', path: '/admin/publications' },
    { icon: GraduationCap, label: 'FDLectures', path: '/admin/fdlectures' },
    { icon: Calendar, label: 'Conferences', path: '/admin/conferences' }
  ];

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
              DA
            </div>
            <span className="font-semibold text-lg">Datta Able</span>
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
            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-slate-700 text-teal-400 border-r-2 border-teal-400' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
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