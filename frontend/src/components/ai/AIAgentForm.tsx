import React, { useState } from 'react';
import { X, Save, Bot, Brain, Activity, Upload, Link } from 'lucide-react';
import type { AIAgent, LLMConfig } from '../../types/ai';

interface AIAgentFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  availableLLMs?: LLMConfig[];
}

export function AIAgentForm({ onClose, onSave, initialData, availableLLMs = [] }: AIAgentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    instructions: initialData?.instructions || '',
    rules: initialData?.rules || '',  // Changed from array to string
    examples: initialData?.examples || [],
    type: initialData?.type || 'chatbot',
    status: initialData?.status || 'active',
    llmId: initialData?.llmId || '',
    capabilities: initialData?.capabilities || [],
    supportDocs: initialData?.supportDocs || [],
    supportUrls: initialData?.supportUrls || []
  });

  const [newExample, setNewExample] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.instructions) {
      newErrors.instructions = 'Instruções são obrigatórias';
    }

    if (!formData.rules.trim()) {
      newErrors.rules = 'Regras são obrigatórias';
    }

    if (!formData.llmId) {
      newErrors.llmId = 'Selecione um LLM';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert rules string to array, splitting by newlines and filtering empty lines
    const rulesArray = formData.rules
      .split('\n')
      .map(rule => rule.trim())
      .filter(rule => rule.length > 0);

    onSave({
      ...formData,
      rules: rulesArray
    });
  };

  const handleAddExample = () => {
    if (newExample.trim()) {
      setFormData(prev => ({
        ...prev,
        examples: [...prev.examples, newExample.trim()]
      }));
      setNewExample('');
    }
  };

  const handleRemoveExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        supportUrls: [...prev.supportUrls, newUrl.trim()]
      }));
      setNewUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportUrls: prev.supportUrls.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      supportDocs: [...prev.supportDocs, ...files]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportDocs: prev.supportDocs.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {initialData ? 'Editar Agente IA' : 'Novo Agente IA'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Agente
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
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="chatbot">Chatbot</option>
                  <option value="classifier">Classificador</option>
                  <option value="analyzer">Analisador</option>
                  <option value="assistant">Assistente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instruções para o Agente
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
                className={`w-full p-2 border rounded-lg ${errors.instructions ? 'border-red-500' : ''}`}
                placeholder="Descreva detalhadamente como o agente deve se comportar e quais são suas responsabilidades..."
              />
              {errors.instructions && (
                <p className="mt-1 text-xs text-red-500">{errors.instructions}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regras
              </label>
              <textarea
                value={formData.rules}
                onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                rows={6}
                className={`w-full p-2 border rounded-lg ${errors.rules ? 'border-red-500' : ''}`}
                placeholder="Digite as regras do agente, uma por linha..."
              />
              {errors.rules && (
                <p className="mt-1 text-xs text-red-500">{errors.rules}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exemplos
              </label>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <textarea
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    placeholder="Digite um exemplo..."
                    className="flex-1 p-2 border rounded-lg"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={handleAddExample}
                    className="btn-secondary"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.examples.length > 0 ? (
                  <div className="space-y-2">
                    {formData.examples.map((example, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <p className="text-sm whitespace-pre-wrap">{example}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveExample(index)}
                          className="text-red-500 hover:text-red-600 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">Nenhum exemplo adicionado</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apoio
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentos de Apoio
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label className="relative cursor-pointer">
                          <span className="text-primary hover:text-primary/80">Upload de arquivo</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                            className="sr-only"
                          />
                        </label>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, DOCX ou TXT
                        </p>
                      </div>
                    </div>
                  </div>
                  {formData.supportDocs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.supportDocs.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URLs de Apoio
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="btn-secondary"
                    >
                      Adicionar
                    </button>
                  </div>
                  {formData.supportUrls.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {formData.supportUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Link className="w-4 h-4 text-gray-400" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:text-primary/80"
                            >
                              {url}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveUrl(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-center p-6 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">Nenhuma URL adicionada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Configuração do LLM</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione o LLM
                </label>
                <select
                  value={formData.llmId}
                  onChange={(e) => setFormData(prev => ({ ...prev, llmId: e.target.value }))}
                  className={`w-full p-2 border rounded-lg ${errors.llmId ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione um LLM</option>
                  {availableLLMs.map(llm => (
                    <option key={llm.id} value={llm.id}>
                      {llm.name} ({llm.provider} - {llm.model})
                    </option>
                  ))}
                </select>
                {errors.llmId && (
                  <p className="mt-1 text-xs text-red-500">{errors.llmId}</p>
                )}
              </div>
            </div>
          </form>
        </div>

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
                <option value="training">Em Treinamento</option>
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