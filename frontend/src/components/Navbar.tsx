import { useState } from 'react';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Database, 
  Shield, 
  Scale, 
  Gavel, 
  Apple as Api, 
  Code, 
  ArrowLeftRight, 
  LayoutDashboard,
  Users,
  UserCircle,
  BookOpen,
  Bot,
  RefreshCw,
  Brain
} from 'lucide-react';

// TODO: Replace with real user role check from backend API endpoint: /api/auth/me

const adminMenuItems = [
  { name: 'Usuários', icon: Users, href: '/admin/users' },
  { name: 'Grupos', icon: UserCircle, href: '/admin/groups' },
  { name: 'Banco de Dados', icon: Database, href: '/admin/databases' },
  { name: 'Base de Conhecimento', icon: BookOpen, href: '/admin/knowledge' },
  { name: 'LGPD', icon: Shield, href: '/admin/lgpd' },
  { name: 'DPO', icon: Scale, href: '/admin/dpo' },
  { name: 'Legal', icon: Gavel, href: '/admin/legal' },
  { name: 'Migrações', icon: ArrowLeftRight, href: '/admin/migrations' },
  { name: 'Agentes IA', icon: Bot, href: '/admin/ai-agents' },
  { name: 'LLMs', icon: Brain, href: '/admin/llms' },
  { name: 'Sincronizações', icon: RefreshCw, href: '/admin/sync' }
];

const routes = {
  '/': { name: 'Dashboard', icon: LayoutDashboard },
  '/data-query': { name: 'DataQueryWise', icon: Database },
  '/lgpd-query': { name: 'LGPDQueryWise', icon: Shield },
  '/dpo-query': { name: 'DPOQueryWise', icon: Scale },
  '/legal-query': { name: 'LegalQueryWise', icon: Gavel },
  '/db-manage': { name: 'DBManageWise', icon: Database },
  '/data-migrate': { name: 'DataMigrateWise', icon: ArrowLeftRight },
  '/easy-api': { name: 'EasyApiWise', icon: Api },
  '/app-gen': { name: 'AppGenWise', icon: Code },
  '/profile': { name: 'Perfil', icon: User }
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const currentRoute = routes[location.pathname as keyof typeof routes];
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Verificar se é admin usando o user do authStore
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    // Usar a função de logout do store
    logout();
    // Navegar para a tela de login
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentRoute && (
            <>
              <currentRoute.icon className="w-6 h-6 text-[#F45E41]" />
              <h1 className="text-xl lg:text-2xl font-bold text-[#46519E] truncate">
                {currentRoute.name}
              </h1>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-[#F45E41]" />
          </button>
          {isAdmin && (
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              >
                <Settings className="w-5 h-5 text-[#F45E41]" />
              </button>
              
              {/* Admin Dropdown Menu */}
              {isAdminMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setIsAdminMenuOpen(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Administrativo
                      </div>
                      {adminMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAdminMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4 mr-3 text-[#F45E41]" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <User className="w-5 h-5 text-[#F45E41]" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Profile</span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-[#F45E41]" />
                      <span>Editar Perfil</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-red-600" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}