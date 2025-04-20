import React from 'react';
import { 
  Database, 
  Shield, 
  Scale,
  Gavel,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Server,
  Book,
  FileText,
  ScrollText,
  Bell,
  Apple as Api,
  Code,
  ArrowLeftRight,
  XCircle,
  Users,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';

// TODO: Replace with real data from backend API endpoint: /api/queries/monthly
const monthlyQueries = [
  { month: 'Jan', queries: 120 },
  { month: 'Feb', queries: 180 },
  { month: 'Mar', queries: 250 },
  { month: 'Apr', queries: 310 },
  { month: 'May', queries: 280 },
  { month: 'Jun', queries: 420 }
];

// TODO: Replace with real data from backend API endpoint: /api/queries/distribution
const queryDistribution = [
  { name: 'DataQueryWise', value: 35 },
  { name: 'LGPDQueryWise', value: 25 },
  { name: 'DPOQueryWise', value: 20 },
  { name: 'LegalQueryWise', value: 20 }
];

// TODO: Replace with real notifications from backend API endpoint: /api/notifications
const mockNotifications = [
  {
    id: '1',
    title: 'Atualização de LGPD',
    message: 'Nova atualização disponível para templates LGPD',
    type: 'info',
    date: '2024-03-15 14:30'
  },
  {
    id: '2',
    title: 'Alerta de Segurança',
    message: 'Verificação de segurança necessária em 3 bancos de dados',
    type: 'warning',
    date: '2024-03-15 13:45'
  },
  {
    id: '3',
    title: 'Backup Concluído',
    message: 'Backup automático realizado com sucesso',
    type: 'success',
    date: '2024-03-15 12:00'
  },
  {
    id: '4',
    title: 'Erro de Sincronização',
    message: 'Falha na sincronização com banco de dados externo',
    type: 'error',
    date: '2024-03-15 11:30'
  }
];

// TODO: Replace with real user services from backend API endpoint: /api/user/services
const userServices = {
  available: [
    { id: 'dataQueryWise', name: 'DataQueryWise', icon: Database, route: '/data-query' },
    { id: 'dbManageWise', name: 'DBManageWise', icon: Server, route: '/db-manage' },
    { id: 'lgpdQueryWise', name: 'LGPDQueryWise', icon: Shield, route: '/lgpd-query' },
    { id: 'dpoQueryWise', name: 'DPOQueryWise', icon: Scale, route: '/dpo-query' },
    { id: 'legalQueryWise', name: 'LegalQueryWise', icon: Gavel, route: '/legal-query' }
  ],
  unavailable: [
    { id: 'dataMigrateWise', name: 'DataMigrateWise', icon: ArrowLeftRight, route: '/data-migrate' },
    { id: 'easyApiWise', name: 'EasyApiWise', icon: Api, route: '/easy-api' },
    { id: 'appGenWise', name: 'AppGenWise', icon: Code, route: '/app-gen' }
  ]
};

// Add service descriptions
const serviceDescriptions = {
  dataQueryWise: 'Ferramenta avançada para consultas e análise de dados com suporte a múltiplos bancos de dados.',
  dbManageWise: 'Gerenciamento centralizado de bancos de dados com monitoramento em tempo real.',
  lgpdQueryWise: 'Análise e conformidade com a Lei Geral de Proteção de Dados (LGPD).',
  dpoQueryWise: 'Suporte ao Data Protection Officer (DPO) com ferramentas de gestão de privacidade.',
  legalQueryWise: 'Análise jurídica e gestão de documentos legais.',
  dataMigrateWise: 'Ferramenta para migração segura e eficiente de dados entre sistemas.',
  easyApiWise: 'Criação e gerenciamento simplificado de APIs RESTful.',
  appGenWise: 'Geração automatizada de código e aplicações.'
};

// TODO: Replace with theme configuration from backend
const COLORS = ['#F45E41', '#46519E', '#4CAF50', '#FFC107'];

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}/10`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
    </div>
  </div>
);

const NotificationItem = ({ notification }) => {
  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-500 bg-green-50';
      case 'error':
        return 'text-red-500 bg-red-50';
      case 'warning':
        return 'text-yellow-500 bg-yellow-50';
      case 'info':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getTypeStyles()}`}>
        {getTypeIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="text-sm text-gray-500 truncate">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
      </div>
    </div>
  );
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard
          title="Conexões Banco de Dados"
          value="12"
          icon={Database}
          trend="2 novos este mês"
        />
        <StatCard
          title="Base de Conhecimentos"
          value="1,234"
          icon={Book}
          trend="+12.5% este mês"
          color="secondary"
        />
        <StatCard
          title="Templates LGPD"
          value="456"
          icon={Shield}
          trend="+8.2% este mês"
        />
        <StatCard
          title="Documentos DPO"
          value="789"
          icon={FileText}
          trend="+15.3% este mês"
          color="secondary"
        />
        <StatCard
          title="Base Legal"
          value="567"
          icon={ScrollText}
          trend="+10.1% este mês"
        />
        <StatCard
          title="Usuários Ativos"
          value="328"
          icon={Users}
          trend="+5.2% este mês"
          color="secondary"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Queries Trend */}
        <div className="lg:col-span-1 card">
          <h3 className="text-lg font-semibold mb-4">Consultas Frequentes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyQueries}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#46519E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#46519E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="queries" 
                  stroke="#46519E" 
                  fillOpacity={1} 
                  fill="url(#colorQueries)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Query Distribution */}
        <div className="lg:col-span-1 card">
          <h3 className="text-lg font-semibold mb-4">Dados por serviços</h3>
          <div className="flex flex-col h-80">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={queryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {queryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4 px-4">
              {queryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Board */}
        <div className="lg:col-span-1 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quadro de Notificações</h3>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
              {mockNotifications.length} novos
            </span>
          </div>
          <div className="space-y-2 h-80 overflow-y-auto custom-scrollbar">
            {mockNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Services */}
        <div className="card bg-green-50 border border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-900">Serviços Disponíveis</h3>
              <p className="text-sm text-green-600">{userServices.available.length} serviços ativos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {userServices.available.map((service) => (
              <div key={service.id} className="flex bg-white rounded-lg">
                <Link
                  to={service.route}
                  className="flex-1 flex items-center p-2 hover:bg-gray-50 transition-colors"
                >
                  <service.icon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-900">{service.name}</span>
                </Link>
                
                {/* Info Icon with Tooltip */}
                <div className="relative flex items-center px-2 border-l border-gray-100">
                  <div className="group">
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      {serviceDescriptions[service.id as keyof typeof serviceDescriptions]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unavailable Services */}
        <div className="card bg-gray-50 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="w-8 h-8 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-900">Serviços Indisponíveis</h3>
              <p className="text-sm text-gray-600">{userServices.unavailable.length} serviços não disponíveis</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {userServices.unavailable.map((service) => (
              <div key={service.id} className="flex bg-white rounded-lg">
                <div className="flex-1 flex items-center p-2">
                  <service.icon className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">{service.name}</span>
                </div>
                
                {/* Info Icon with Tooltip */}
                <div className="relative flex items-center px-2 border-l border-gray-100">
                  <div className="group">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      {serviceDescriptions[service.id as keyof typeof serviceDescriptions]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}