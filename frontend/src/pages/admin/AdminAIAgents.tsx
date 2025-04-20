import React, { useState } from 'react';
import { Bot, Search, Plus } from 'lucide-react';
import { AIAgentForm } from '../../components/ai/AIAgentForm';
import { AIAgentCard } from '../../components/ai/AIAgentCard';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { AIAgent, LLMConfig } from '../../types/ai';

// TODO: Replace with real data from API
const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Legal Assistant AI',
    description: 'AI agent specialized in legal document analysis and compliance',
    type: 'assistant',
    status: 'active',
    model: 'GPT-4',
    version: '2.1.0',
    lastTrained: '2024-03-10',
    capabilities: [
      'Document Analysis',
      'Legal Compliance Check',
      'Contract Review',
      'Risk Assessment'
    ],
    integrations: [
      'Document Management System',
      'Legal Database',
      'Compliance Tools'
    ],
    llmId: '1'
  }
];

// TODO: Replace with real data from API
const mockLLMs: LLMConfig[] = [
  {
    id: '1',
    name: 'GPT-4 Production',
    provider: 'openai',
    model: 'gpt-4',
    description: 'Modelo principal para produção',
    status: 'active',
    temperature: 0.7,
    maxInputTokens: 8000,
    maxOutputTokens: 2000,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Claude Staging',
    provider: 'anthropic',
    model: 'claude-3-opus',
    description: 'Modelo para testes e desenvolvimento',
    status: 'active',
    temperature: 0.5,
    maxInputTokens: 100000,
    maxOutputTokens: 4000,
    createdAt: '2024-03-14',
    updatedAt: '2024-03-15'
  }
];

export function AdminAIAgents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);

  const handleSaveAgent = (data: any) => {
    if (selectedAgent) {
      setAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id ? { ...agent, ...data } : agent
      ));
    } else {
      const newAgent: AIAgent = {
        id: Date.now().toString(),
        ...data,
        version: '1.0.0',
        lastTrained: new Date().toISOString().split('T')[0],
        integrations: []
      };
      setAgents(prev => [...prev, newAgent]);
    }
    setShowNewAgentForm(false);
    setSelectedAgent(null);
  };

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setShowNewAgentForm(true);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgentToDelete(agentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      setAgents(prev => prev.filter(agent => agent.id !== agentToDelete));
      setAgentToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agentes IA</h1>
          <p className="text-gray-500">Gerenciamento de Agentes de Inteligência Artificial</p>
        </div>
        <button
          onClick={() => {
            setSelectedAgent(null);
            setShowNewAgentForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agente</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar agentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="paused">Pausados</option>
          <option value="error">Com Erro</option>
          <option value="configuring">Configurando</option>
        </select>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <AIAgentCard
            key={agent.id}
            agent={agent}
            onEdit={handleEditAgent}
            onDelete={handleDeleteAgent}
          />
        ))}
      </div>

      {/* AI Agent Form Modal */}
      {showNewAgentForm && (
        <AIAgentForm
          onClose={() => {
            setShowNewAgentForm(false);
            setSelectedAgent(null);
          }}
          onSave={handleSaveAgent}
          initialData={selectedAgent}
          availableLLMs={mockLLMs}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Agente"
        message="Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando 1-10 de 50 resultados
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Anterior
          </button>
          <button className="px-3 py-1 border rounded bg-primary text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}