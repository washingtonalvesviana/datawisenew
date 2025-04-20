import React, { useState } from 'react';
import { 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Scale, 
  MessageSquare, 
  FileText, 
  Download,
  Link,
  FileCheck,
  AlertTriangle,
  Database,
  BarChart,
  PieChart as PieChartIcon
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
import type { Message, DataSource, ComplianceReport } from '../types/services';

// TODO: Replace with real data sources from backend API endpoint: /api/dpo/sources
const mockDataSources: DataSource[] = [
  { 
    id: '1', 
    name: 'Sistema Principal', 
    type: 'database', 
    status: 'connected', 
    lastAnalysis: '2024-03-15',
    metadata: {
      size: '1.2 TB',
      items: 1250000
    }
  },
  { 
    id: '2', 
    name: 'Documentos Cloud', 
    type: 'cloud', 
    status: 'connected', 
    lastAnalysis: '2024-03-14',
    metadata: {
      size: '800 GB',
      items: 45000
    }
  },
  { 
    id: '3', 
    name: 'Servidor Local', 
    type: 'database', 
    status: 'issues', 
    lastAnalysis: '2024-03-13',
    metadata: {
      size: '500 GB',
      items: 890000
    }
  }
];

// TODO: Replace with real compliance reports from backend API endpoint: /api/dpo/reports
const mockReports: ComplianceReport[] = [
  {
    id: '1',
    title: 'Análise de Dados Sensíveis',
    date: '2024-03-15',
    type: 'Dados Pessoais',
    status: 'compliant',
    details: 'Todos os dados sensíveis estão adequadamente protegidos',
    riskLevel: 'low'
  },
  {
    id: '2',
    title: 'Verificação de Consentimento',
    date: '2024-03-14',
    type: 'Consentimento',
    status: 'review-needed',
    details: 'Necessária revisão dos termos de consentimento',
    riskLevel: 'medium'
  }
];

// TODO: Replace with real compliance trend data from backend API endpoint: /api/dpo/trends
const complianceTrendData = [
  { month: 'Jan', score: 82 },
  { month: 'Feb', score: 84 },
  { month: 'Mar', score: 87 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 87 }
];

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

export function DPOQueryWise() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // TODO: Replace with real message sending to backend API endpoint: /api/dpo/analyze
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response with DPO analysis
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Analisando conformidade e gerando relatório DPO...",
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis',
        metadata: {
          riskLevel: 'medium',
          dataTypes: ['CPF', 'Email', 'Endereço'],
          complianceStatus: 'review-needed'
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getStatusColor = (status: ComplianceReport['status']) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'non-compliant':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'review-needed':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (level: ComplianceReport['riskLevel']) => {
    switch (level) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      {/* Data Source Selection */}
      <div className="bg-white p-4 border-b flex-shrink-0">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Selecione uma fonte de dados</option>
          {mockDataSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
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
                  {message.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {message.metadata.riskLevel && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            message.metadata.riskLevel === 'high' ? 'text-red-500' :
                            message.metadata.riskLevel === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`} />
                          <span className="text-xs font-medium">
                            Nível de Risco: {message.metadata.riskLevel}
                          </span>
                        </div>
                      )}
                      {message.metadata.dataTypes && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Tipos de Dados Identificados:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.metadata.dataTypes.map((type, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs"
                              >
                                {type}
                              </span>
                            ))}
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
                <Scale className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Análise DPO</p>
                <p className="text-sm">Faça perguntas sobre proteção de dados e conformidade</p>
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
                placeholder="Digite sua consulta para o DPO..."
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
          <Scale className="w-6 h-6" />
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
                {/* Compliance Trend Chart */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Tendência de Conformidade</h2>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={complianceTrendData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#46519E" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#46519E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#46519E"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Data Sources */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Database className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Fontes de Dados</h2>
                  </div>
                  <div className="space-y-3">
                    {mockDataSources.map((source) => (
                      <div
                        key={source.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{source.name}</h3>
                            <p className="text-sm text-gray-500">
                              {source.metadata?.items?.toLocaleString()} itens
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            source.status === 'connected' ? 'bg-green-100 text-green-700' :
                            source.status === 'issues' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {source.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex justify-between items-center">
                            <span>Tamanho: {source.metadata?.size}</span>
                            <span>Última análise: {source.lastAnalysis}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Reports */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <FileCheck className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Relatórios de Conformidade</h2>
                  </div>
                  <div className="space-y-3">
                    {mockReports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 rounded-lg border ${getStatusColor(report.status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{report.title}</h3>
                          <span className={`text-xs font-medium ${getRiskColor(report.riskLevel)}`}>
                            {report.riskLevel?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{report.details}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{report.type}</span>
                          <span>{report.date}</span>
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