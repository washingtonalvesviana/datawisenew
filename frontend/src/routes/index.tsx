import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuthStore } from '../store/authStore';

// Componente de carregamento
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Autenticação
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));

// Páginas principais (lazy loaded)
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const DataQueryWise = lazy(() => import('../pages/DataQueryWise').then(module => ({ default: module.DataQueryWise })));
const LGPDQueryWise = lazy(() => import('../pages/LGPDQueryWise').then(module => ({ default: module.LGPDQueryWise })));
const DPOQueryWise = lazy(() => import('../pages/DPOQueryWise').then(module => ({ default: module.DPOQueryWise })));
const LegalQueryWise = lazy(() => import('../pages/LegalQueryWise').then(module => ({ default: module.LegalQueryWise })));
const DBManageWise = lazy(() => import('../pages/DBManageWise').then(module => ({ default: module.DBManageWise })));
const DataMigrateWise = lazy(() => import('../pages/DataMigrateWise').then(module => ({ default: module.DataMigrateWise })));
const EasyApiWise = lazy(() => import('../pages/EasyApiWise').then(module => ({ default: module.EasyApiWise })));
const AppGenWise = lazy(() => import('../pages/AppGenWise').then(module => ({ default: module.AppGenWise })));
const Profile = lazy(() => import('../pages/Profile').then(module => ({ default: module.Profile })));

// Páginas admin (lazy loaded e agrupadas por funcionalidade)
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers').then(module => ({ default: module.AdminUsers })));
const AdminGroups = lazy(() => import('../pages/admin/AdminGroups').then(module => ({ default: module.AdminGroups })));
const AdminDatabases = lazy(() => import('../pages/admin/AdminDatabases').then(module => ({ default: module.AdminDatabases })));
const AdminKnowledge = lazy(() => import('../pages/admin/AdminKnowledge').then(module => ({ default: module.AdminKnowledge })));
const AdminLGPD = lazy(() => import('../pages/admin/AdminLGPD').then(module => ({ default: module.AdminLGPD })));
const AdminDPO = lazy(() => import('../pages/admin/AdminDPO').then(module => ({ default: module.AdminDPO })));
const AdminLegal = lazy(() => import('../pages/admin/AdminLegal').then(module => ({ default: module.AdminLegal })));
const AdminMigrations = lazy(() => import('../pages/admin/AdminMigrations').then(module => ({ default: module.AdminMigrations })));
const AdminAIAgents = lazy(() => import('../pages/admin/AdminAIAgents').then(module => ({ default: module.AdminAIAgents })));
const AdminLLMs = lazy(() => import('../pages/admin/AdminLLMs').then(module => ({ default: module.AdminLLMs })));
const AdminSync = lazy(() => import('../pages/admin/AdminSync').then(module => ({ default: module.AdminSync })));

// Proteção de rota
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Proteção de rota admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

// Componente para verificar se deve renderizar o layout
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Lista de rotas que não devem usar o layout
  const noLayoutRoutes = ['/login'];
  
  // Se a rota atual estiver na lista de rotas sem layout
  if (noLayoutRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }
  
  // Caso contrário, renderiza com o layout
  return <Layout>{children}</Layout>;
};

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/data-query" element={<ProtectedRoute><DataQueryWise /></ProtectedRoute>} />
          <Route path="/lgpd-query" element={<ProtectedRoute><LGPDQueryWise /></ProtectedRoute>} />
          <Route path="/dpo-query" element={<ProtectedRoute><DPOQueryWise /></ProtectedRoute>} />
          <Route path="/legal-query" element={<ProtectedRoute><LegalQueryWise /></ProtectedRoute>} />
          <Route path="/db-manage" element={<ProtectedRoute><DBManageWise /></ProtectedRoute>} />
          <Route path="/data-migrate" element={<ProtectedRoute><DataMigrateWise /></ProtectedRoute>} />
          <Route path="/easy-api" element={<ProtectedRoute><EasyApiWise /></ProtectedRoute>} />
          <Route path="/app-gen" element={<ProtectedRoute><AppGenWise /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Rotas admin */}
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/groups" element={<AdminRoute><AdminGroups /></AdminRoute>} />
          <Route path="/admin/databases" element={<AdminRoute><AdminDatabases /></AdminRoute>} />
          <Route path="/admin/knowledge" element={<AdminRoute><AdminKnowledge /></AdminRoute>} />
          <Route path="/admin/lgpd" element={<AdminRoute><AdminLGPD /></AdminRoute>} />
          <Route path="/admin/dpo" element={<AdminRoute><AdminDPO /></AdminRoute>} />
          <Route path="/admin/legal" element={<AdminRoute><AdminLegal /></AdminRoute>} />
          <Route path="/admin/migrations" element={<AdminRoute><AdminMigrations /></AdminRoute>} />
          <Route path="/admin/ai-agents" element={<AdminRoute><AdminAIAgents /></AdminRoute>} />
          <Route path="/admin/llms" element={<AdminRoute><AdminLLMs /></AdminRoute>} />
          <Route path="/admin/sync" element={<AdminRoute><AdminSync /></AdminRoute>} />

          {/* Redireciona rotas desconhecidas para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </Suspense>
  );
}