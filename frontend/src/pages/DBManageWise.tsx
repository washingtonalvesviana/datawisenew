import React, { useState } from 'react';
import { 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Database, 
  MessageSquare,
  Server,
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  HardDrive,
  Users as UsersIcon
} from 'lucide-react';
import type { DatabaseConnection, Message } from '../types/services';

// TODO: Replace with real database connections from backend API endpoint: /api/databases/list
const mockDatabases: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Production DB',
    type: 'postgres',
    status: 'connected',
    host: 'db.production.com',
    size: '1.2 TB',
    lastCheck: '2024-03-15',
    metrics: {
      queryTime: '45ms',
      cpu: 65,
      memory: 78,
      connections: 120
    }
  },
  {
    id: '2',
    name: 'Analytics DB',
    type: 'mysql',
    status: 'connected',
    host: 'analytics.db.com',
    size: '800 GB',
    lastCheck: '2024-03-15',
    metrics: {
      queryTime: '32ms',
      cpu: 45,
      memory: 62,
      connections: 85
    }
  },
  {
    id: '3',
    name: 'Legacy System',
    type: 'oracle',
    status: 'issues',
    host: 'legacy.internal',
    size: '500 GB',
    lastCheck: '2024-03-14',
    metrics: {
      queryTime: '120ms',
      cpu: 89,
      memory: 92,
      connections: 45
    }
  }
];

export function DBManageWise() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // TODO: Replace with real message sending to backend API endpoint: /api/databases/analyze
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response with database analysis
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Analisando banco de dados e métricas de performance...",
        sender: 'ai',
        timestamp: new Date(),
        type: 'performance',
        metadata: {
          databaseInfo: {
            name: 'Production DB',
            size: '1.2 TB',
            tables: 245,
            indexes: 892
          },
          performance: {
            queryTime: '45ms',
            cpu: 65,
            memory: 78
          }
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getStatusColor = (status: DatabaseConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'issues':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-red-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      {/* Database Selection */}
      <div className="bg-white p-4 border-b flex-shrink-0">
        <select
          value={selectedDatabase}
          onChange={(e) => setSelectedDatabase(e.target.value)}
          className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Selecione um banco de dados</option>
          {mockDatabases.map((db) => (
            <option key={db.id} value={db.id}>
              {db.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-l-xl shadow-sm overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 custom-scrollbar p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.metadata?.databaseInfo && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Database:</span>
                          <span className="text-xs">{message.metadata.databaseInfo.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Size:</span>
                          <span className="text-xs">{message.metadata.databaseInfo.size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Tables:</span>
                          <span className="text-xs">{message.metadata.databaseInfo.tables}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Indexes:</span>
                          <span className="text-xs">{message.metadata.databaseInfo.indexes}</span>
                        </div>
                      </div>
                      {message.metadata.performance && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium mb-2">Performance Metrics:</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Query Time:</span>
                              <span className="text-xs">{message.metadata.performance.queryTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">CPU Usage:</span>
                              <span className="text-xs">{message.metadata.performance.cpu}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Memory Usage:</span>
                              <span className="text-xs">{message.metadata.performance.memory}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Database className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Gerenciamento de Banco de Dados</p>
                <p className="text-sm">Faça perguntas sobre seus bancos de dados</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua consulta sobre o banco de dados..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="btn-primary p-2 rounded-lg"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Analytics Panel Toggle Button */}
        <button
          onClick={() => setIsAnalyticsPanelOpen(!isAnalyticsPanelOpen)}
          className="lg:hidden fixed z-20 bottom-[150px] right-4 bg-primary text-white p-3 rounded-full shadow-lg"
        >
          <Database className="w-6 h-6" />
        </button>

        {/* Analytics Sidebar */}
        <div
          className={`
            fixed lg:relative right-0 top-0 h-full bg-white border-l
            transition-all duration-300 z-10 overflow-hidden
            ${isAnalyticsPanelOpen ? 'w-96' : 'w-0 lg:w-12'}
          `}
        >
          <button
            onClick={() => setIsAnalyticsPanelOpen(!isAnalyticsPanelOpen)}
            className="hidden lg:flex w-12 h-12 items-center justify-center text-gray-500 hover:text-gray-700"
          >
            {isAnalyticsPanelOpen ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {isAnalyticsPanelOpen && (
            <div className="h-full custom-scrollbar">
              <div className="p-6 w-96">
                {/* Database Status */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Server className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Status dos Bancos</h2>
                  </div>
                  <div className="space-y-4">
                    {mockDatabases.map((db) => (
                      <div
                        key={db.id}
                        className="p-4 bg-white rounded-lg border shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{db.name}</h3>
                            <p className="text-sm text-gray-500">{db.host}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(db.status)}`}>
                            {db.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <HardDrive className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{db.size}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{db.metrics?.queryTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${getMetricColor(db.metrics?.cpu || 0)}`}>
                              {db.metrics?.cpu}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UsersIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{db.metrics?.connections}</span>
                          </div>
                        </div>

                        {db.status === 'issues' && (
                          <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-yellow-700">Performance issues detected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Métricas de Performance</h2>
                  </div>
                  <div className="space-y-4">
                    {mockDatabases.map((db) => (
                      <div key={db.id} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-3">{db.name}</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>CPU Usage</span>
                              <span className={getMetricColor(db.metrics?.cpu || 0)}>
                                {db.metrics?.cpu}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (db.metrics?.cpu || 0) >= 90 ? 'bg-red-500' :
                                  (db.metrics?.cpu || 0) >= 75 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${db.metrics?.cpu}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Memory Usage</span>
                              <span className={getMetricColor(db.metrics?.memory || 0)}>
                                {db.metrics?.memory}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (db.metrics?.memory || 0) >= 90 ? 'bg-red-500' :
                                  (db.metrics?.memory || 0) >= 75 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${db.metrics?.memory}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}