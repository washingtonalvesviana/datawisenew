import React, { useState } from 'react';
import { X, Save, Brain, Settings, Activity } from 'lucide-react';
import type { LLMConfig } from '../../types/ai';

interface LLMFormProps {
  onClose: () => void;
  onSave: (data: LLMConfig) => void;
  initialData?: LLMConfig | null;
}

const llmProviders = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'mistral', name: 'Mistral AI' },
  { id: 'ollama', name: 'Ollama' }
];

const defaultModels = {
  openai: ['gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'],
  gemini: ['gemini-pro', 'gemini-pro-vision'],
  mistral: ['mistral-small', 'mistral-medium', 'mistral-large'],
  ollama: ['llama2', 'mistral', 'codellama']
};

export function LLMForm({ onClose, onSave, initialData }: LLMFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    provider: initialData?.provider || 'gemini',
    model: initialData?.model || 'gemini-pro',
    apiKey: initialData?.apiKey || '',
    baseUrl: initialData?.baseUrl || '',
    temperature: initialData?.temperature || 0.7,
    maxInputTokens: initialData?.maxInputTokens || 4000,
    maxOutputTokens: initialData?.maxOutputTokens || 1000,
    status: initialData?.status || 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.apiKey) {
      newErrors.apiKey = 'Chave da API é obrigatória';
    }

    if (formData.temperature < 0 || formData.temperature > 2) {
      newErrors.temperature = 'Temperatura deve estar entre 0 e 2';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave(formData as LLMConfig);
  };

  const getModelsForProvider = (provider: string) => {
    return defaultModels[provider as keyof typeof defaultModels] || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {initialData ? 'Editar LLM' : 'Novo LLM'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do LLM
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provedor
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    provider: e.target.value,
                    model: getModelsForProvider(e.target.value)[0] || ''
                  }))}
                  className="w-full p-2 border rounded-lg"
                >
                  {llmProviders.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Model Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Configuração do Modelo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {getModelsForProvider(formData.provider).map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chave da API
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${errors.apiKey ? 'border-red-500' : ''}`}
                  />
                  {errors.apiKey && (
                    <p className="mt-1 text-xs text-red-500">{errors.apiKey}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Base da API
                  </label>
                  <input
                    type="text"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="Deixe em branco para usar o padrão"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperatura
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      temperature: parseFloat(e.target.value)
                    }))}
                    className={`w-full p-2 border rounded-lg ${errors.temperature ? 'border-red-500' : ''}`}
                  />
                  {errors.temperature && (
                    <p className="mt-1 text-xs text-red-500">{errors.temperature}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tokens de Entrada Máx.
                  </label>
                  <input
                    type="number"
                    value={formData.maxInputTokens}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxInputTokens: parseInt(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tokens de Saída Máx.
                  </label>
                  <input
                    type="number"
                    value={formData.maxOutputTokens}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxOutputTokens: parseInt(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="p-2 border rounded-lg"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}