import React, { useState } from 'react';
import {
  Code2,
  PlayCircle,
  Save,
  Plus,
  Search,
  FileJson,
  Server,
  Book,
  Settings,
  Globe,
  Copy,
  Send,
  Trash2,
  Edit,
  X,
  Download,
  FileCode,
  Terminal,
  Braces
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
}

// TODO: Replace with real code snippets from backend API endpoint: /api/code-snippets
const mockSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'User Authentication System',
    description: 'Complete user authentication system with JWT',
    language: 'typescript',
    code: `import jwt from 'jsonwebtoken';

export class AuthService {
  private readonly secretKey = process.env.JWT_SECRET;

  async login(email: string, password: string) {
    // Authentication logic here
    const token = jwt.sign({ email }, this.secretKey);
    return token;
  }
}`,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    status: 'completed'
  }
];

const supportedLanguages = [
  { id: 'html', name: 'HTML', icon: '🌐' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'javascript', name: 'JavaScript', icon: '📜' },
  { id: 'typescript', name: 'TypeScript', icon: '💪' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'csharp', name: 'C#', icon: '🎯' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'php', name: 'PHP', icon: '🐘' },
  { id: 'cobol', name: 'COBOL', icon: '🏢' }
];

export function AppGenWise() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSnippetForm, setShowNewSnippetForm] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>(mockSnippets);
  const [codeDescription, setCodeDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      typescript: 'text-blue-600 bg-blue-50 border-blue-200',
      javascript: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      python: 'text-green-600 bg-green-50 border-green-200',
      java: 'text-red-600 bg-red-50 border-red-200',
      csharp: 'text-purple-600 bg-purple-50 border-purple-200',
      html: 'text-orange-600 bg-orange-50 border-orange-200',
      css: 'text-pink-600 bg-pink-50 border-pink-200',
      php: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      cpp: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      cobol: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[language] || colors.cobol;
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeDescription.trim() || !selectedLanguage) return;

    setIsGenerating(true);
    
    // Simulate code generation
    setTimeout(() => {
      const newSnippet: CodeSnippet = {
        id: Date.now().toString(),
        title: codeDescription.split('\n')[0],
        description: codeDescription,
        language: selectedLanguage,
        code: '// Generated code will appear here\n// Based on your description\n',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'completed'
      };

      setSnippets(prev => [...prev, newSnippet]);
      setSelectedSnippet(newSnippet);
      setShowNewSnippetForm(false);
      setIsGenerating(false);
      setCodeDescription('');
      setSelectedLanguage('');
    }, 2000);
  };

  const handleDeleteSnippet = (id: string) => {
    if (window.confirm('Are you sure you want to delete this code snippet?')) {
      setSnippets(prev => prev.filter(snippet => snippet.id !== id));
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null);
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // TODO: Show success toast
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">AppGenWise</h1>
          <button
            onClick={() => setShowNewSnippetForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Código</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-white overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar códigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Snippets List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  selectedSnippet?.id === snippet.id
                    ? 'bg-gray-50 border-primary'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(snippet.language)}`}>
                    {supportedLanguages.find(lang => lang.id === snippet.language)?.name || snippet.language}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedSnippet(snippet)}
                      className="p-1 text-gray-500 hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {snippet.title}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {snippet.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {showNewSnippetForm ? (
            <div className="max-w-3xl mx-auto p-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Gerar Novo Código</h2>
                  <button
                    onClick={() => setShowNewSnippetForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleGenerateCode}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Linguagem
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        <option value="">Selecione uma linguagem</option>
                        {supportedLanguages.map(lang => (
                          <option key={lang.id} value={lang.id}>
                            {lang.icon} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descreva o código que você precisa
                      </label>
                      <textarea
                        value={codeDescription}
                        onChange={(e) => setCodeDescription(e.target.value)}
                        placeholder="Ex: Crie uma classe para gerenciar autenticação de usuários com suporte a JWT, incluindo métodos para login, logout e verificação de token..."
                        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!codeDescription.trim() || !selectedLanguage || isGenerating}
                      className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <Globe className="w-5 h-5 animate-spin" />
                          <span>Gerando Código...</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-5 h-5" />
                          <span>Gerar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : selectedSnippet ? (
            <div className="p-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedSnippet.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedSnippet.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getLanguageColor(selectedSnippet.language)}`}>
                      {supportedLanguages.find(lang => lang.id === selectedSnippet.language)?.name}
                    </span>
                    <button
                      onClick={() => handleCopyCode(selectedSnippet.code)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                    </button>
                    <button className="btn-primary flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Code Editor */}
                  <div className="relative">
                    <div className="absolute top-0 right-0 flex items-center space-x-2 p-2">
                      <button className="p-1 text-gray-500 hover:text-primary">
                        <Terminal className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-primary">
                        <Braces className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto font-mono">
                      {selectedSnippet.code}
                    </pre>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Created: {new Date(selectedSnippet.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(selectedSnippet.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4" />
                      <span>{selectedSnippet.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Code2 className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecione ou crie um novo código</p>
              <p className="text-sm">Use IA para gerar código em diferentes linguagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}