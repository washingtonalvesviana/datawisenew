import React, { useState } from 'react';
import { 
  Shield, 
  Upload, 
  Save,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Settings,
  Search,
  Bot,
  X,
  Plus,
  Edit,
  Trash2,
  Users,
  ChevronDown,
  Database
} from 'lucide-react';
import { DataSourceForm } from '../../components/knowledge/DataSourceForm';
import type { DataSource } from '../../types/knowledge';
import { PersonalDataCard } from '../../components/lgpd/PersonalDataCard';
import { SensitiveDataCard } from '../../components/lgpd/SensitiveDataCard';
import { LGPDGroupCard } from '../../components/lgpd/LGPDGroupCard';

interface PersonalData {
  id: string;
  field: string;
  type: 'personal' | 'sensitive';
  category: string;
  source: string;
  context: string;
  identified: boolean;
}

interface LGPDTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  dataSources: DataSource[];
  personalData: PersonalData[];
  createdAt: string;
  updatedAt: string;
}

interface LGPDTemplateFormProps {
  onClose: () => void;
  onSave: (template: LGPDTemplate) => void;
  initialData?: LGPDTemplate;
}

const availableGroups = [
  { id: '1', name: 'Financeiro', userCount: 25 },
  { id: '2', name: 'Contabilidade', userCount: 15 },
  { id: '3', name: 'Auditoria', userCount: 8 },
  { id: '4', name: 'TI', userCount: 12 },
  { id: '5', name: 'RH', userCount: 10 }
];

const groupDataBySource = (data: PersonalData[]) => {
  return data.reduce((groups, item) => {
    const source = item.source;
    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(item);
    return groups;
  }, {} as Record<string, PersonalData[]>);
};

export function LGPDTemplateForm({ onClose, onSave, initialData }: LGPDTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<LGPDTemplate>>(initialData || {
    name: '',
    description: '',
    version: '1.0.0',
    status: 'draft',
    dataSources: [],
    personalData: [],
    groups: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);

  const [analysisConfig, setAnalysisConfig] = useState({
    sensitivity: 'high',
    includeContext: true,
    identifyPatterns: true,
    checkCompliance: true,
    generateRecommendations: true
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.dataSources?.length) {
      newErrors.dataSources = 'Adicione pelo menos uma fonte de dados';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const template: LGPDTemplate = {
      id: initialData?.id || Date.now().toString(),
      ...formData as Omit<LGPDTemplate, 'id'>,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(template);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newPersonalData: PersonalData[] = [
        {
          id: '1',
          field: 'email',
          type: 'personal',
          category: 'Contato',
          source: 'users.email',
          context: 'Usado para autenticação e comunicação',
          identified: true
        },
        {
          id: '2',
          field: 'cpf',
          type: 'sensitive',
          category: 'Identificação',
          source: 'users.documents',
          context: 'Identificação única do usuário',
          identified: true
        }
      ];

      setFormData(prev => ({
        ...prev,
        personalData: [...(prev.personalData || []), ...newPersonalData]
      }));
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleRemovePersonalData = (id: string) => {
    setFormData(prev => ({
      ...prev,
      personalData: prev.personalData?.filter(data => data.id !== id) || []
    }));
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => {
      const currentGroups = prev.groups || [];
      const group = availableGroups.find(g => g.id === groupId);
      
      if (!group) return prev;

      if (currentGroups.some(g => g.id === groupId)) {
        return {
          ...prev,
          groups: currentGroups.filter(g => g.id !== groupId)
        };
      }

      return {
        ...prev,
        groups: [...currentGroups, group]
      };
    });
  };

  const toggleSource = (source: string) => {
    setExpandedSources(prev => 
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {initialData ? 'Editar Template LGPD' : 'Novo Template LGPD'}
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
                  Nome do Template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Versão
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
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
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Data Sources */}
            <div>
              <DataSourceForm
                dataSources={formData.dataSources || []}
                onChange={(dataSources) => setFormData(prev => ({ ...prev, dataSources }))}
                error={errors.dataSources}
              />
            </div>

            {/* Analysis Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !formData.dataSources?.length}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Bot className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analisando...' : 'Analisar Dados'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigPanel(!showConfigPanel)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configurar Análise</span>
                </button>
              </div>
            </div>

            {/* Configuration Panel */}
            {showConfigPanel && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Configurações da Análise</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sensibilidade da Análise
                    </label>
                    <select
                      value={analysisConfig.sensitivity}
                      onChange={(e) => setAnalysisConfig(prev => ({ 
                        ...prev, 
                        sensitivity: e.target.value 
                      }))}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={analysisConfig.includeContext}
                        onChange={(e) => setAnalysisConfig(prev => ({
                          ...prev,
                          includeContext: e.target.checked
                        }))}
                      />
                      <span className="text-sm">Incluir contexto dos dados</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={analysisConfig.identifyPatterns}
                        onChange={(e) => setAnalysisConfig(prev => ({
                          ...prev,
                          identifyPatterns: e.target.checked
                        }))}
                      />
                      <span className="text-sm">Identificar padrões de dados</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={analysisConfig.checkCompliance}
                        onChange={(e) => setAnalysisConfig(prev => ({
                          ...prev,
                          checkCompliance: e.target.checked
                        }))}
                      />
                      <span className="text-sm">Verificar conformidade LGPD</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={analysisConfig.generateRecommendations}
                        onChange={(e) => setAnalysisConfig(prev => ({
                          ...prev,
                          generateRecommendations: e.target.checked
                        }))}
                      />
                      <span className="text-sm">Gerar recomendações</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Data Results */}
            {formData.personalData && formData.personalData.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Dados Pessoais Identificados</h3>
                <div className="space-y-3">
                  {Object.entries(groupDataBySource(formData.personalData)).map(([source, items]) => (
                    <div key={source} className="border rounded-lg overflow-hidden">
                      {/* Source Header */}
                      <button
                        type="button"
                        onClick={() => toggleSource(source)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700">{source}</span>
                          <span className="text-sm text-gray-500">
                            ({items.length} {items.length === 1 ? 'item' : 'itens'})
                          </span>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedSources.includes(source) ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Source Content */}
                      {expandedSources.includes(source) && (
                        <div className="divide-y">
                          {items.map((data) => (
                            <div
                              key={data.id}
                              className="p-4 bg-white flex items-start justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    data.type === 'sensitive' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {data.type === 'sensitive' ? 'Sensível' : 'Pessoal'}
                                  </span>
                                  <h4 className="font-medium">{data.field}</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Categoria:</span>
                                    <span className="ml-2">{data.category}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{data.context}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemovePersonalData(data.id)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Grupos</h3>
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleGroupToggle(group.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      formData.groups?.some(g => g.id === group.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.userCount} usuários
                    </span>
                  </button>
                ))}
              </div>
              {errors.groups && (
                <p className="mt-1 text-xs text-red-500">{errors.groups}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as LGPDTemplate['status']
                }))}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="archived">Arquivado</option>
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
                <span>Salvar Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}