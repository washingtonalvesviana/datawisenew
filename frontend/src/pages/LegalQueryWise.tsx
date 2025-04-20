import React, { useState } from 'react';
import { 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Gavel, 
  MessageSquare, 
  FileText, 
  Download,
  Link,
  FileCheck,
  AlertTriangle,
  Database,
  Scale
} from 'lucide-react';
import type { Message, DataSource, ComplianceReport } from '../types/services';

// TODO: Replace with real legal sources from backend API endpoint: /api/legal/sources
const mockLegalSources: DataSource[] = [
  {
    id: '1',
    name: 'Contratos Ativos',
    type: 'database',
    status: 'connected',
    lastAnalysis: '2024-03-15',
    metadata: {
      size: '500 MB',
      items: 1250
    }
  },
  {
    id: '2',
    name: 'Regulamentações',
    type: 'document',
    status: 'connected',
    lastAnalysis: '2024-03-14',
    metadata: {
      size: '250 MB',
      items: 450
    }
  },
  {
    id: '3',
    name: 'Processos Jurídicos',
    type: 'archive',
    status: 'issues',
    lastAnalysis: '2024-03-13',
    metadata: {
      size: '1.2 GB',
      items: 890
    }
  }
];

// TODO: Replace with real legal risks from backend API endpoint: /api/legal/risks
const mockLegalRisks: ComplianceReport[] = [
  {
    id: '1',
    title: 'Atualização de Contratos',
    date: '2024-04-15',
    type: 'Contratos',
    status: 'review-needed',
    details: 'Necessidade de atualização dos contratos conforme nova legislação',
    riskLevel: 'high'
  },
  {
    id: '2',
    title: 'Revisão de Políticas',
    date: '2024-04-30',
    type: 'Compliance',
    status: 'compliant',
    details: 'Revisão das políticas internas de compliance',
    riskLevel: 'low'
  }
];

export function LegalQueryWise() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // TODO: Replace with real message sending to backend API endpoint: /api/legal/analyze
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response with legal analysis
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Analisando aspectos legais e conformidade...",
        sender: 'ai',
        timestamp: new Date(),
        type: 'legal',
        metadata: {
          riskLevel: 'medium',
          legalIssues: [
            'Atualização necessária em cláusulas contratuais',
            'Revisão de termos de uso requerida'
          ],
          recommendations: [
            'Atualizar contratos até 15/04/2024',
            'Implementar processo de revisão periódica'
          ],
          relevantLaws: [
            'Lei Geral de Proteção de Dados (LGPD)',
            'Código de Defesa do Consumidor'
          ]
        }
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getRiskColor = (severity: ComplianceReport['riskLevel']) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: ComplianceReport['status']) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'non-compliant':
        return 'text-red-600 bg-red-50';
      case 'review-needed':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      {/* Legal Source Selection */}
      <div className="bg-white p-4 border-b flex-shrink-0">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Selecione uma fonte legal</option>
          {mockLegalSources.map((source) => (
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
                        <div className="flex items-center space-x-2 mb-2">
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
                      {message.metadata.legalIssues && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Questões Legais:</p>
                          <ul className="text-xs space-y-1 list-disc list-inside">
                            {message.metadata.legalIssues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.metadata.recommendations && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Recomendações:</p>
                          <ul className="text-xs space-y-1 list-disc list-inside">
                            {message.metadata.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.metadata.relevantLaws && (
                        <div className="mt-2">
                          <p className="text-xs font-medium mb-1">Legislação Aplicável:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.metadata.relevantLaws.map((law, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs"
                              >
                                {law}
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
                <Gavel className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Análise Legal</p>
                <p className="text-sm">Faça perguntas sobre aspectos legais e conformidade</p>
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
                placeholder="Digite sua consulta legal..."
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
          <Gavel className="w-6 h-6" />
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
                {/* Legal Sources */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Fontes Legais</h2>
                  </div>
                  <div className="space-y-3">
                    {mockLegalSources.map((source) => (
                      <div
                        key={source.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{source.name}</h3>
                            <p className="text-sm text-gray-500">
                              {source.metadata?.items?.toLocaleString()} itens • {source.metadata?.size}
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
                          Última análise: {source.lastAnalysis}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Risks */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Riscos Legais</h2>
                  </div>
                  <div className="space-y-3">
                    {mockLegalRisks.map((risk) => (
                      <div
                        key={risk.id}
                        className={`p-4 rounded-lg border ${getRiskColor(risk.riskLevel)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{risk.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(risk.status)}`}>
                            {risk.status === 'compliant' ? 'Conforme' :
                             risk.status === 'non-compliant' ? 'Não Conforme' :
                             'Requer Revisão'}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{risk.details}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{risk.type}</span>
                          <span>Prazo: {risk.date}</span>
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