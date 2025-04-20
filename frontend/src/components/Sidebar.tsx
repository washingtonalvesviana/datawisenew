import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Database, 
  Shield, 
  Scale, 
  Gavel, 
  Apple as Api, 
  Code, 
  ArrowLeftRight, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'DataQueryWise', icon: Database, href: '/data-query' },
  { name: 'LGPDQueryWise', icon: Shield, href: '/lgpd-query' },
  { name: 'DPOQueryWise', icon: Scale, href: '/dpo-query' },
  { name: 'LegalQueryWise', icon: Gavel, href: '/legal-query' },
  { name: 'DBManageWise', icon: Database, href: '/db-manage' },
  { name: 'DataMigrateWise', icon: ArrowLeftRight, href: '/data-migrate' },
  { name: 'EasyApiWise', icon: Api, href: '/easy-api' },
  { name: 'AppGenWise', icon: Code, href: '/app-gen' }
];

export function Sidebar({ onCloseMobileMenu }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNavClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <aside 
      className={`
        ${isExpanded ? 'w-64' : 'w-16'} 
        bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative
        h-full
      `}
    >
      <div className="h-full py-4 flex flex-col">
        <div className={`${isExpanded ? 'px-3 mb-6' : 'px-2 mb-6'} flex justify-center`}>
          {isExpanded ? (
            <Logo />
          ) : (
            <div className="w-8 h-8">
              <img 
                src="https://datawiseservice.com/imgs/logo_datawise_box_color.png"
                alt="DW" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        
        {/* Toggle Button - Hidden on mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow hidden lg:block"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-[#F45E41]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#F45E41]" />
          )}
        </button>
        
        <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center ${isExpanded ? 'px-3' : 'px-2 justify-center'} py-2 text-sm font-medium rounded-lg
                ${isActive 
                  ? 'bg-secondary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                } transition-all duration-300`
              }
              title={!isExpanded ? item.name : undefined}
            >
              <item.icon className={`${isExpanded ? 'mr-3' : 'mr-0'} h-5 w-5 text-[#F45E41]`} />
              {isExpanded && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}