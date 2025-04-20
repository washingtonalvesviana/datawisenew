import React from 'react';
import { Brain, Edit, Trash2, Settings, Activity, Bot, Clock, Database } from 'lucide-react';
import type { LLMConfig } from '../../types/ai';

interface LLMCardProps {
  llm: LLMConfig;
  onEdit: (llm: LLMConfig) => void;
  onDelete: (id: string) => void;
}

export function LLMCard({ llm, onEdit, onDelete }: LLMCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProviderName = (provider: string) => {
    const providers: Record<string, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      gemini: 'Google Gemini',
      mistral: 'Mistral AI',
      ollama: 'Ollama'
    };
    return providers[provider] || provider;
  };

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-gray-900">{llm.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(llm.status)}`}>
              {llm.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{llm.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(llm)}
            className="p-1 text-gray-500 hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(llm.id)}
            className="p-1 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Provedor</p>
              <p className="font-medium">{getProviderName(llm.provider)}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Modelo</p>
              <p className="font-medium">{llm.model}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Temperatura</p>
              <p className="font-medium">{llm.temperature}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Tokens</p>
              <p className="font-medium">{llm.maxInputTokens}/{llm.maxOutputTokens}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      {llm.usage && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas de Uso</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Total de Requisições:</span>
              <span className="ml-2 font-medium">{llm.usage.totalRequests.toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Latência Média:</span>
              <span className="ml-2 font-medium">{llm.usage.averageLatency}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Custo Mensal:</span>
              <span className="ml-2 font-medium">
                ${llm.usage.costPerMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}