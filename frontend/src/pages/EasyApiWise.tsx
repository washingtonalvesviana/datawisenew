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
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Copy,
  ExternalLink,
  Download,
  Send,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import type { ApiEndpoint, ApiDeployment } from '../types/services';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  metadata?: {
    apiSpec?: Partial<ApiEndpoint>;
    documentation?: string;
    deploymentInfo?: Partial<ApiDeployment>;
  };
}

// TODO: Replace with real API endpoints from backend API endpoint: /api/endpoints
const mockEndpoints: ApiEndpoint[] = [
  {
    id: '1',
    method: 'GET',
    path: '/api/users',
    description: 'List all users with pagination',
    parameters: {
      query: [
        {
          name: 'page',
          type: 'number',
          description: 'Page number',
          required: false,
          default: 1
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Items per page',
          required: false,
          default: 10
        }
      ]
    },
    responses: {
      '200': {
        description: 'Successful response',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                pages: { type: 'number' },
                current: { type: 'number' }
              }
            }
          }
        }
      }
    },
    authentication: {
      type: 'bearer',
      required: true
    },
    version: '1.0.0',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    status: 'published'
  }
];

// TODO: Replace with real deployments from backend API endpoint: /api/deployments
const mockDeployments: ApiDeployment[] = [
  {
    id: '1',
    environment: 'development',
    url: 'https://api-dev.example.com',
    version: '1.0.0',
    deployedAt: '2024-03-15 10:00:00',
    status: 'active'
  },
  {
    id: '2',
    environment: 'staging',
    url: 'https://api-staging.example.com',
    version: '1.0.0',
    deployedAt: '2024-03-15 11:00:00',
    status: 'active'
  }
];

export function EasyApiWise() {
  const [activeTab, setActiveTab] = useState<'design' | 'documentation' | 'deployment'>('design');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEndpointForm, setShowNewEndpointForm] = useState(false);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(mockEndpoints);
  const [apiDescription, setApiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getMethodColor = (method: ApiEndpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'POST':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PUT':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'DELETE':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PATCH':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDeploymentStatusColor = (status: ApiDeployment['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'deploying':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDeploymentStatusIcon = (status: ApiDeployment['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'deploying':
        return <Globe className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDeploy = (environment: ApiDeployment['environment']) => {
    // TODO: Implement deployment logic
    console.log(`Deploying to ${environment}...`);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: Show success toast
  };

  const handleGenerateApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiDescription.trim()) return;

    setIsGenerating(true);
    
    // Simulate API generation
    setTimeout(() => {
      const newEndpoint: ApiEndpoint = {
        id: Date.now().toString(),
        method: 'GET',
        path: '/api/users',
        description: apiDescription,
        parameters: {
          query: [
            {
              name: 'page',
              type: 'number',
              description: 'Page number',
              required: false,
              default: 1
            }
          ]
        },
        responses: {
          '200': {
            description: 'Successful response',
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          }
        },
        authentication: {
          type: 'bearer',
          required: true
        },
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };

      setEndpoints(prev => [...prev, newEndpoint]);
      setSelectedEndpoint(newEndpoint);
      setShowNewEndpointForm(false);
      setIsGenerating(false);
      setApiDescription('');
    }, 2000);
  };

  const handleDeleteEndpoint = (id: string) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
      if (selectedEndpoint?.id === id) {
        setSelectedEndpoint(null);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      {/* Header with Tabs */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">EasyApiWise</h1>
          <button
            onClick={() => setShowNewEndpointForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Endpoint</span>
          </button>
        </div>
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'design'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Design</span>
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'documentation'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Documentação</span>
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
              activeTab === 'deployment'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Deployment</span>
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
                placeholder="Buscar endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Endpoints List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`w-full p-3 rounded-lg border transition-colors ${
                  selectedEndpoint?.id === endpoint.id
                    ? 'bg-gray-50 border-primary'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className="p-1 text-gray-500 hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEndpoint(endpoint.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {endpoint.path}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {showNewEndpointForm ? (
            <div className="max-w-3xl mx-auto p-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Criar Nova API</h2>
                  <button
                    onClick={() => setShowNewEndpointForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleGenerateApi}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descreva a API que você precisa
                      </label>
                      <textarea
                        value={apiDescription}
                        onChange={(e) => setApiDescription(e.target.value)}
                        placeholder="Ex: Crie uma API RESTful para gerenciar usuários com autenticação JWT, incluindo endpoints para criar, listar, atualizar e deletar usuários..."
                        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!apiDescription.trim() || isGenerating}
                      className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <Globe className="w-5 h-5 animate-spin" />
                          <span>Gerando API...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Gerar API</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {activeTab === 'design' && selectedEndpoint && (
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                        {selectedEndpoint.method}
                      </span>
                      <h2 className="text-lg font-semibold">{selectedEndpoint.path}</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary">
                        <Save className="w-4 h-4" />
                      </button>
                      <button className="btn-primary flex items-center space-x-2">
                        <PlayCircle className="w-4 h-4" />
                        <span>Testar</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Parameters */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Parâmetros</h3>
                      <div className="space-y-4">
                        {selectedEndpoint.parameters?.query && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">Query Parameters</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                              {selectedEndpoint.parameters.query.map((param) => (
                                <div key={param.name} className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">{param.name}</p>
                                    <p className="text-xs text-gray-500">{param.description}</p>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-gray-500">{param.type}</span>
                                    {param.required && (
                                      <span className="ml-2 text-red-500">Required</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Responses */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Respostas</h3>
                      <div className="space-y-4">
                        {Object.entries(selectedEndpoint.responses).map(([code, response]) => (
                          <div key={code}>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                code.startsWith('2') ? 'bg-green-100 text-green-700' :
                                code.startsWith('4') ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {code}
                              </span>
                              <span className="text-sm text-gray-500">{response.description}</span>
                            </div>
                            <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                              {JSON.stringify(response.schema, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Authentication */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Autenticação</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium capitalize">{selectedEndpoint.authentication?.type}</p>
                            <p className="text-xs text-gray-500">
                              {selectedEndpoint.authentication?.required ? 'Required' : 'Optional'}
                            </p>
                          </div>
                          <button className="text-sm text-primary hover:text-primary/80">
                            Configurar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documentation' && selectedEndpoint && (
                <div className="p-6 space-y-6">
                  {/* OpenAPI Specification */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileJson className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">OpenAPI Specification</h2>
                      </div>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                      {JSON.stringify({
                        openapi: '3.0.0',
                        info: {
                          title: 'API Documentation',
                          version: selectedEndpoint.version
                        },
                        paths: {
                          [selectedEndpoint.path]: {
                            [selectedEndpoint.method.toLowerCase()]: {
                              description: selectedEndpoint.description,
                              parameters: selectedEndpoint.parameters,
                              responses: selectedEndpoint.responses
                            }
                          }
                        }
                      }, null, 2)}
                    </pre>
                  </div>

                  {/* Code Snippets */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code2 className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold">Code Snippets</h2>
                    </div>
                    <div className="space-y-4">
                      {/* Curl */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">cURL</h3>
                          <button className="text-sm text-primary hover:text-primary/80">
                            Copy
                          </button>
                        </div>
                        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                          {`curl -X ${selectedEndpoint.method} \\
  "${mockDeployments[0].url}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <token>"`}
                        </pre>
                      </div>

                      {/* JavaScript */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">JavaScript</h3>
                          <button className="text-sm text-primary hover:text-primary/80">
                            Copy
                          </button>
                        </div>
                        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                          {`fetch("${mockDeployments[0].url}${selectedEndpoint.path}", {
  method: "${selectedEndpoint.method}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                        </pre>
                      </div>

                      {/* Python */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Python</h3>
                          <button className="text-sm text-primary hover:text-primary/80">
                            Copy
                          </button>
                        </div>
                        <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto">
                          {`import requests

response = requests.${selectedEndpoint.method.toLowerCase()}(
    "${mockDeployments[0].url}${selectedEndpoint.path}",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer <token>"
    }
)
print(response.json())`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'deployment' && (
                <div className="p-6 space-y-6">
                  {/* Deployment Controls */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold">Deploy API</h2>
                        <p className="text-sm text-gray-500">Deploy your API to different environments</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                          <option value="1.0.0">v1.0.0</option>
                          <option value="0.9.0">v0.9.0</option>
                        </select>
                        <button
                          onClick={() => handleDeploy('development')}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Server className="w-4 h-4" />
                          <span>Deploy</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockDeployments.map((deployment) => (
                        <div
                          key={deployment.id}
                          className="p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getDeploymentStatusColor(deployment.status)}`}>
                                {getDeploymentStatusIcon(deployment.status)}
                              </div>
                              <div>
                                <h3 className="font-medium capitalize">{deployment.environment}</h3>
                                <p className="text-sm text-gray-500">v{deployment.version}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCopyUrl(deployment.url)}
                                className="p-2 text-gray-500 hover:text-gray-700"
                                title="Copy URL"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <a
                                href={deployment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-gray-700"
                                title="Open URL"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{deployment.url}</span>
                            <span>•</span>
                            <span>Deployed: {deployment.deployedAt}</span>
                          </div>

                          {deployment.status === 'failed' && deployment.error && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-center space-x-2 text-sm text-red-700">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span>{deployment.error}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environment Variables */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Environment Variables</h2>
                      </div>
                      <button className="btn-secondary">
                        Add Variable
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">DATABASE_URL</p>
                          <p className="text-sm text-gray-500">Production database connection string</p>
                        </div>
                        <button className="text-primary hover:text-primary/80">
                          Edit
                        </button>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">API_KEY</p>
                          <p className="text-sm text-gray-500">API authentication key</p>
                        </div>
                        <button className="text-primary hover:text-primary/80">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}