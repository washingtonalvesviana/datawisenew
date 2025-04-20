import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  Search, 
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  FileText,
  MessageSquare,
  Tag,
  Link
} from 'lucide-react';
import { LegalDocumentForm } from './legal/LegalDocumentForm';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { LegalDocument } from '../../types/legal';

// TODO: Replace with real documents data from backend API endpoint: /api/legal/documents
const mockDocuments: LegalDocument[] = [
  {
    id: '1',
    title: 'Contrato de Prestação de Serviços',
    type: 'contract',
    status: 'active',
    description: 'Contrato padrão para prestação de serviços de consultoria',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    responsible: 'Maria Santos',
    deadline: '2024-12-31',
    parties: [
      { id: '1', name: 'DataWise', role: 'Prestador' },
      { id: '2', name: 'Cliente A', role: 'Contratante' }
    ],
    dataSources: [
      {
        id: '1',
        name: 'Base de Contratos',
        type: 'database',
        status: 'active',
        path: 'contracts_db',
        lastSync: '2024-03-15'
      }
    ],
    tags: ['contrato', 'serviços', 'consultoria'],
    groups: [
      { id: '1', name: 'Jurídico', userCount: 15 },
      { id: '2', name: 'Comercial', userCount: 25 }
    ]
  },
  {
    id: '2',
    title: 'Política de Privacidade',
    type: 'policy',
    status: 'review',
    description: 'Política de privacidade e proteção de dados pessoais',
    createdAt: '2024-03-14',
    updatedAt: '2024-03-14',
    responsible: 'João Silva',
    parties: [
      { id: '1', name: 'DataWise', role: 'Empresa' }
    ],
    dataSources: [
      {
        id: '1',
        name: 'Documentos Legais',
        type: 'folder',
        status: 'active',
        path: '/legal/policies',
        lastSync: '2024-03-14'
      }
    ],
    tags: ['lgpd', 'privacidade', 'dados pessoais'],
    groups: [
      { id: '1', name: 'Jurídico', userCount: 15 },
      { id: '3', name: 'Compliance', userCount: 8 }
    ]
  }
];

export function AdminLegal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  const handleEdit = (documentId: string) => {
    const document = mockDocuments.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setShowDocumentForm(true);
    }
  };

  const handleDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic
    console.log('Deleting document:', documentToDelete);
    setShowDeleteConfirmation(false);
  };

  const getStatusColor = (status: LegalDocument['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'archived':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal</h1>
          <p className="text-gray-500">Gestão de Documentos e Casos Jurídicos</p>
        </div>
        <button
          onClick={() => {
            setSelectedDocument(null);
            setShowDocumentForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Documento</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar documentos..."
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
          <option value="review">Em Revisão</option>
          <option value="draft">Rascunhos</option>
          <option value="expired">Expirados</option>
        </select>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDocuments.map((document) => (
          <div
            key={document.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{document.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(document.status)}`}>
                    {document.status === 'active' ? 'Ativo' :
                     document.status === 'review' ? 'Em Revisão' :
                     document.status === 'expired' ? 'Expirado' :
                     'Arquivado'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{document.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(document.id)}
                  className="p-1 text-gray-500 hover:text-primary"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            {document.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Groups */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos Associados</h4>
              <div className="space-y-2">
                {document.groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{group.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.userCount} usuários
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Form Modal */}
      {showDocumentForm && (
        <LegalDocumentForm
          onClose={() => {
            setShowDocumentForm(false);
            setSelectedDocument(null);
          }}
          initialData={selectedDocument}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Documento"
        message="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
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