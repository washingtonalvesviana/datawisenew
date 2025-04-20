import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, Mail, Phone, Calendar, Database, Upload, Globe, FileJson, Code, Users, Plus, Save, X, AlertTriangle, Bot, BarChart as ChartBar, FileCheck, Brain, Award, Target, Activity, BookOpen, Zap, TrendingUp } from 'lucide-react';

interface DPOAnalysis {
  complianceIndex: number;
  experienceLevel: 'Junior' | 'Pleno' | 'Senior' | 'Specialist';
  competencies: {
    lgpdKnowledge: number;
    riskManagement: number;
    trainingAbility: number;
    incidentResponse: number;
  };
  certifications: {
    name: string;
    status: 'active' | 'expired' | 'pending';
    expirationDate?: string;
  }[];
  projectHistory: {
    name: string;
    role: string;
    impact: string;
    date: string;
  }[];
  metrics: {
    complianceMonitoring: number;
    policyDevelopment: number;
    incidentManagement: number;
    trainingsDelivered: number;
  };
  recommendations: {
    area: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface DPOForm {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: boolean;
  documents: File[];
  analysis?: DPOAnalysis;
}

interface FormErrors {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  documents?: string;
}

export function DPORegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState<DPOForm>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: true,
    documents: []
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Nome completo deve ter pelo menos 3 caracteres';
    }

    if (!formData.company) {
      newErrors.company = 'Empresa é obrigatória';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone || !/^\+\d{2}\s\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido (formato: +XX (XX) XXXXX-XXXX)';
    }

    if (formData.documents.length === 0) {
      newErrors.documents = 'Adicione pelo menos um documento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleAnalyzeProfile = async () => {
    if (!validateForm()) return;

    setAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: DPOAnalysis = {
        complianceIndex: 85,
        experienceLevel: 'Senior',
        competencies: {
          lgpdKnowledge: 90,
          riskManagement: 85,
          trainingAbility: 75,
          incidentResponse: 80
        },
        certifications: [
          {
            name: 'LGPD Professional',
            status: 'active',
            expirationDate: '2025-03-15'
          },
          {
            name: 'ISO 27701 Lead Implementer',
            status: 'active',
            expirationDate: '2024-12-31'
          }
        ],
        projectHistory: [
          {
            name: 'LGPD Implementation',
            role: 'Project Lead',
            impact: 'Successfully implemented LGPD compliance across organization',
            date: '2023-06'
          }
        ],
        metrics: {
          complianceMonitoring: 88,
          policyDevelopment: 92,
          incidentManagement: 85,
          trainingsDelivered: 78
        },
        recommendations: [
          {
            area: 'Technical Knowledge',
            description: 'Enhance knowledge of emerging privacy technologies',
            priority: 'medium'
          },
          {
            area: 'Certification',
            description: 'Consider obtaining CIPT certification',
            priority: 'high'
          }
        ]
      };

      setFormData(prev => ({
        ...prev,
        analysis: mockAnalysis
      }));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !formData.analysis) {
      if (!formData.analysis) {
        alert('Por favor, realize a análise do perfil antes de salvar.');
      }
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement API call to save DPO data
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/dpo');
    } catch (error) {
      console.error('Error saving DPO:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (title: string, value: number, icon: React.ReactNode) => (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        {icon}
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-2xl font-bold">{value}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              value >= 90 ? 'bg-green-500' :
              value >= 70 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DPO Dashboard - Cadastro</h1>
          <p className="text-gray-500">Cadastro e gerenciamento de Data Protection Officers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${errors.company ? 'border-red-500' : ''}`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full p-2 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+55 (11) 98765-4321"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Documentos</h2>
            <div className="space-y-4">
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

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{file.name}</span>
                      </div>
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
          </div>

          {/* Analysis Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAnalyzeProfile}
              disabled={analyzing}
              className="btn-primary flex items-center space-x-2 px-6"
            >
              {analyzing ? (
                <>
                  <Bot className="w-5 h-5 animate-spin" />
                  <span>Analisando Perfil...</span>
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  <span>Analisar Perfil</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {formData.analysis && (
          <div className="space-y-6">
            {/* Compliance Index */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Índice de Conformidade</h3>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#46519E ${formData.analysis.complianceIndex}%, #e5e7eb ${formData.analysis.complianceIndex}%)`
                      }}
                    />
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">{formData.analysis.complianceIndex}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competencies */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Competências</h3>
              <div className="space-y-4">
                {renderMetricCard(
                  'Conhecimento LGPD/GDPR',
                  formData.analysis.competencies.lgpdKnowledge,
                  <Shield className="w-5 h-5 text-primary" />
                )}
                {renderMetricCard(
                  'Gestão de Riscos',
                  formData.analysis.competencies.riskManagement,
                  <Target className="w-5 h-5 text-primary" />
                )}
                {renderMetricCard(
                  'Capacidade de Treinamento',
                  formData.analysis.competencies.trainingAbility,
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
                {renderMetricCard(
                  'Resposta a Incidentes',
                  formData.analysis.competencies.incidentResponse,
                  <Zap className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Métricas de Desempenho</h3>
              <div className="space-y-4">
                {Object.entries(formData.analysis.metrics).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-sm font-medium">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recomendações</h3>
              <div className="space-y-3">
                {formData.analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-50' :
                      rec.priority === 'medium' ? 'bg-yellow-50' :
                      'bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{rec.area}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => navigate('/admin/dpo')}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !formData.analysis}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Salvando...' : 'Salvar e Adicionar ao Dashboard'}</span>
        </button>
      </div>
    </div>
  );
}