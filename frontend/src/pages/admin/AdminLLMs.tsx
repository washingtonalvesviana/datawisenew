import React, { useState } from 'react';
import { Brain, Search, Plus, Edit, Trash2, Settings, Activity, Bot } from 'lucide-react';
import { LLMForm } from '../../components/llm/LLMForm';
import { LLMCard } from '../../components/llm/LLMCard';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { LLMConfig } from '../../types/ai';

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
    updatedAt: '2024-03-15',
    usage: {
      totalRequests: 15000,
      averageLatency: '150ms',
      costPerMonth: 250.50
    }
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
    updatedAt: '2024-03-15',
    usage: {
      totalRequests: 5000,
      averageLatency: '180ms',
      costPerMonth: 120.75
    }
  }
];

export function AdminLLMs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showLLMForm, setShowLLMForm] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<LLMConfig | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [llmToDelete, setLLMToDelete] = useState<string | null>(null);
  const [llms, setLLMs] = useState<LLMConfig[]>(mockLLMs);

  const handleSaveLLM = (data: LLMConfig) => {
    if (selectedLLM) {
      setLLMs(prev => prev.map(llm => 
        llm.id === selectedLLM.id ? { ...llm, ...data } : llm
      ));
    } else {
      const newLLM: LLMConfig = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usage: {
          totalRequests: 0,
          averageLatency: '0ms',
          costPerMonth: 0
        }
      };
      setLLMs(prev => [...prev, newLLM]);
    }
    setShowLLMForm(false);
    setSelectedLLM(null);
  };

  const handleEditLLM = (llm: LLMConfig) => {
    setSelectedLLM(llm);
    setShowLLMForm(true);
  };

  const handleDeleteLLM = (llmId: string) => {
    setLLMToDelete(llmId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (llmToDelete) {
      setLLMs(prev => prev.filter(llm => llm.id !== llmToDelete));
      setLLMToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LLMs</h1>
          <p className="text-gray-500">Gerenciamento de Modelos de Linguagem</p>
        </div>
        <button
          onClick={() => {
            setSelectedLLM(null);
            setShowLLMForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo LLM</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar LLMs..."
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
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* LLMs List */}
      <div className="space-y-6">
        {llms.map((llm) => (
          <LLMCard
            key={llm.id}
            llm={llm}
            onEdit={handleEditLLM}
            onDelete={handleDeleteLLM}
          />
        ))}
      </div>

      {/* LLM Form Modal */}
      {showLLMForm && (
        <LLMForm
          onClose={() => {
            setShowLLMForm(false);
            setSelectedLLM(null);
          }}
          onSave={handleSaveLLM}
          initialData={selectedLLM}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir LLM"
        message="Tem certeza que deseja excluir este LLM? Esta ação não pode ser desfeita."
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