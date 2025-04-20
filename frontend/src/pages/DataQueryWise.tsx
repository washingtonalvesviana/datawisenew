import React, { useState } from 'react';
import { Send, ChevronRight, ChevronLeft, Database, MessageSquare, FileText, Download } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface DatabaseStats {
  schemas: number;
  tables: number;
  columns: number;
  records: number;
  documents: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  url: string;
}

// TODO: Replace with real database list from backend API endpoint: /api/databases/list
const mockDatabases = [
  { id: 1, name: 'Banco de Dados Principal' },
  { id: 2, name: 'Banco de Dados Secundário' },
  { id: 3, name: 'Banco de Dados de Teste' },
];

// TODO: Replace with real-time stats from backend API endpoint: /api/databases/stats
const mockStats: DatabaseStats = {
  schemas: 5,
  tables: 25,
  columns: 150,
  records: 1000000,
  documents: 50000,
};

// TODO: Replace with real documents list from backend API endpoint: /api/documents/list
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Relatório Mensal.pdf',
    type: 'PDF',
    size: '2.5 MB',
    lastModified: '2024-03-15',
    url: '#'
  },
  {
    id: '2',
    name: 'Análise de Dados.xlsx',
    type: 'Excel',
    size: '1.8 MB',
    lastModified: '2024-03-14',
    url: '#'
  },
  {
    id: '3',
    name: 'Documentação.docx',
    type: 'Word',
    size: '956 KB',
    lastModified: '2024-03-13',
    url: '#'
  },
];

export function DataQueryWise() {
  // TODO: Replace with real-time messages from backend API endpoint: /api/messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(true);
  const [selectedDatabase, setSelectedDatabase] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // TODO: Replace with real message sending to backend API endpoint: /api/messages/send
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // TODO: Replace with real AI response from backend API endpoint: /api/ai/response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Analisando sua consulta. Por favor, aguarde um momento...",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // TODO: Replace with real document download handler connected to backend API endpoint: /api/documents/download
  const handleDownload = (document: Document) => {
    console.log(`Baixando documento: ${document.name}`);
  };

  const toggleAnalyticsPanel = () => {
    setIsAnalyticsPanelOpen(!isAnalyticsPanelOpen);
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
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Inicie uma nova conversa</p>
                <p className="text-sm">Faça perguntas sobre seus dados</p>
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
                placeholder="Digite sua mensagem..."
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

        {/* Analytics Panel Toggle Button for Mobile */}
        <button
          onClick={toggleAnalyticsPanel}
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
            onClick={toggleAnalyticsPanel}
            className="hidden lg:flex w-12 h-12 items-center justify-center text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            {isAnalyticsPanelOpen ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {isAnalyticsPanelOpen && (
            <div className="h-full custom-scrollbar">
              <div className="p-6 w-96">
                <div className="flex items-center space-x-2 mb-6">
                  <Database className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">Estatísticas do Banco</h2>
                </div>

                {/* Database Stats */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Schemas</p>
                        <p className="text-xl font-semibold">{mockStats.schemas}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Tabelas</p>
                        <p className="text-xl font-semibold">{mockStats.tables}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Colunas</p>
                        <p className="text-xl font-semibold">{mockStats.columns}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Registros</p>
                        <p className="text-xl font-semibold">{mockStats.records.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Documentos</h3>
                      </div>
                      <span className="text-sm text-gray-600">
                        {mockStats.documents.toLocaleString()} total
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {mockDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white p-3 rounded-md shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.name}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.lastModified}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="ml-4 p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                            title="Baixar documento"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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