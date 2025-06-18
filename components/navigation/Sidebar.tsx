import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileBox, 
  User, 
  Video, 
  Settings, 
  Users, 
  BarChart, 
  CreditCard,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
      isActive 
        ? 'bg-white/5 text-white' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside className="hidden md:flex flex-col w-64 glassmorphism border-r border-white/5 p-4">
      <div className="flex-1 py-8">
        <nav className="space-y-2">
          {isAdmin ? (
            <>
              <NavLink to="/admin" end className={navLinkClass}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClass}>
                <FileBox className="h-5 w-5" />
                <span>Orders</span>
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="h-5 w-5" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/admin/payments" className={navLinkClass}>
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={navLinkClass}>
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </NavLink>
              <NavLink to="/admin/settings" className={navLinkClass}>
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" end className={navLinkClass}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/upload" className={navLinkClass}>
                <Upload className="h-5 w-5" />
                <span>Upload Photos</span>
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                <FileBox className="h-5 w-5" />
                <span>Orders</span>
              </NavLink>
              <NavLink to="/floorplan" className={navLinkClass}>
                <Layers className="h-5 w-5" />
                <span>Floorplan Creator</span>
              </NavLink>
              <NavLink to="/floorplans" className={navLinkClass}>
                <Layers className="h-5 w-5" />
                <span>My Floorplans</span>
              </NavLink>
              <NavLink to="/tutorials" className={navLinkClass}>
                <Video className="h-5 w-5" />
                <span>Tutorials</span>
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                <User className="h-5 w-5" />
                <span>Profile</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
      
      <div className="bg-white/5 p-4 rounded-lg mt-4">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-white/80 mb-4">
          Our support team is available 24/7 to assist you with any questions.
        </p>
        <button className="btn btn-primary w-full">
          Contact Support
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;