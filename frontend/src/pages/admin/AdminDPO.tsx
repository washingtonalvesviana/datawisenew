import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Plus, Filter } from 'lucide-react';
import { DPOForm } from '../../components/dpo/DPOForm';
import { DPOCard } from '../../components/dpo/DPOCard';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { DPOFormData } from '../../types/dpo';

// TODO: Replace with real data from API
const mockDPOs: DPOFormData[] = [
  {
    id: '1',
    name: 'DPO Principal',
    description: 'Responsável pela conformidade LGPD geral da empresa',
    status: 'active',
    dataSources: [
      {
        id: '1',
        name: 'Banco de Dados Principal',
        type: 'database',
        status: 'active',
        path: 'db.example.com',
        lastSync: '2024-03-15'
      }
    ],
    groups: [
      { id: '1', name: 'Financeiro', userCount: 25 },
      { id: '2', name: 'TI', userCount: 12 }
    ],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
];

export function AdminDPO() {
  const navigate = useNavigate();
  const [showDPOForm, setShowDPOForm] = useState(false);
  const [selectedDPO, setSelectedDPO] = useState<DPOFormData | null>(null);
  const [dpos, setDPOs] = useState<DPOFormData[]>(mockDPOs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [dpoToDelete, setDPOToDelete] = useState<string | null>(null);

  const handleSaveDPO = (dpo: DPOFormData) => {
    if (selectedDPO) {
      // Update existing DPO
      setDPOs(prev => prev.map(d => 
        d.id === dpo.id ? dpo : d
      ));
    } else {
      // Add new DPO
      setDPOs(prev => [...prev, dpo]);
    }
    setShowDPOForm(false);
    setSelectedDPO(null);
  };

  const handleEditDPO = (dpo: DPOFormData) => {
    setSelectedDPO(dpo);
    setShowDPOForm(true);
  };

  const handleDeleteDPO = (dpoId: string) => {
    setDPOToDelete(dpoId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (dpoToDelete) {
      setDPOs(prev => prev.filter(d => d.id !== dpoToDelete));
      setDPOToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DPO Dashboard</h1>
          <p className="text-gray-500">Gestão de Data Protection Officers</p>
        </div>
        <button
          onClick={() => setShowDPOForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo DPO</span>
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar DPOs..."
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dpos.map((dpo) => (
          <DPOCard
            key={dpo.id}
            dpo={dpo}
            onEdit={handleEditDPO}
            onDelete={handleDeleteDPO}
          />
        ))}
      </div>

      {showDPOForm && (
        <DPOForm
          onClose={() => {
            setShowDPOForm(false);
            setSelectedDPO(null);
          }}
          onSave={handleSaveDPO}
          initialData={selectedDPO}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir DPO"
        message="Tem certeza que deseja excluir este DPO? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}