import React, { useState } from 'react';
import { X, Save, Database, RefreshCw, Clock, Calendar } from 'lucide-react';

interface SyncRegistrationFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Available services for sync
const availableServices = [
  { id: 'dataquery', name: 'DataQueryWise', type: 'database' },
  { id: 'lgpdquery', name: 'LGPDQueryWise', type: 'database' },
  { id: 'dpoquery', name: 'DPOQueryWise', type: 'database' },
  { id: 'legalquery', name: 'LegalQueryWise', type: 'database' },
  { id: 'dbmanage', name: 'DBManageWise', type: 'database' },
  { id: 'datamigrate', name: 'DataMigrateWise', type: 'database' }
];

// Mock records for each service
const mockRecords = {
  dataquery: [
    { id: '1', name: 'Customer Data', type: 'table', recordCount: 15000 },
    { id: '2', name: 'Order History', type: 'table', recordCount: 25000 }
  ],
  lgpdquery: [
    { id: '1', name: 'Personal Data Records', type: 'table', recordCount: 5000 },
    { id: '2', name: 'Consent Logs', type: 'table', recordCount: 8000 }
  ],
  dpoquery: [
    { id: '1', name: 'DPO Reports', type: 'document', recordCount: 150 },
    { id: '2', name: 'Compliance Records', type: 'table', recordCount: 3000 }
  ],
  legalquery: [
    { id: '1', name: 'Legal Documents', type: 'document', recordCount: 500 },
    { id: '2', name: 'Contract Data', type: 'table', recordCount: 2000 }
  ],
  dbmanage: [
    { id: '1', name: 'Database Metrics', type: 'table', recordCount: 10000 },
    { id: '2', name: 'Performance Logs', type: 'table', recordCount: 50000 }
  ],
  datamigrate: [
    { id: '1', name: 'Migration History', type: 'table', recordCount: 1000 },
    { id: '2', name: 'Migration Logs', type: 'table', recordCount: 5000 }
  ]
};

interface ScheduleConfig {
  type: 'daily' | 'weekly' | 'monthly';
  time: string;
  weekDay?: number; // 0-6 for weekly
  monthDay?: number; // 1-31 for monthly
}

export function SyncRegistrationForm({ onClose, onSubmit }: SyncRegistrationFormProps) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    type: 'daily',
    time: '00:00'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedService) {
      newErrors.service = 'Selecione um serviço';
    }

    if (selectedRecords.length === 0) {
      newErrors.records = 'Selecione pelo menos um registro';
    }

    if (!schedule.time) {
      newErrors.time = 'Selecione um horário';
    }

    if (schedule.type === 'weekly' && schedule.weekDay === undefined) {
      newErrors.weekDay = 'Selecione um dia da semana';
    }

    if (schedule.type === 'monthly' && schedule.monthDay === undefined) {
      newErrors.monthDay = 'Selecione um dia do mês';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      service: selectedService,
      records: selectedRecords,
      schedule
    });
  };

  const handleSelectAllRecords = () => {
    if (selectedService) {
      const records = mockRecords[selectedService as keyof typeof mockRecords];
      setSelectedRecords(records.map(record => record.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedRecords([]);
  };

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const weekDays = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Nova Sincronização</h2>
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
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serviço
              </label>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setSelectedRecords([]);
                }}
                className={`w-full p-2 border rounded-lg ${errors.service ? 'border-red-500' : ''}`}
              >
                <option value="">Selecione um serviço</option>
                {availableServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="mt-1 text-xs text-red-500">{errors.service}</p>
              )}
            </div>

            {/* Records Selection */}
            {selectedService && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Registros para Sincronização
                  </label>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={handleSelectAllRecords}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      Selecionar Todos
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Limpar Seleção
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {mockRecords[selectedService as keyof typeof mockRecords]?.map(record => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => toggleRecordSelection(record.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium">{record.name}</p>
                          <p className="text-sm text-gray-500">
                            {record.type} • {record.recordCount.toLocaleString()} registros
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.records && (
                  <p className="mt-1 text-xs text-red-500">{errors.records}</p>
                )}
              </div>
            )}

            {/* Schedule Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Agendamento</h3>
              
              {/* Schedule Type */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={schedule.type === 'daily'}
                    onChange={() => setSchedule(prev => ({ ...prev, type: 'daily' }))}
                    className="text-primary"
                  />
                  <span>Diário</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={schedule.type === 'weekly'}
                    onChange={() => setSchedule(prev => ({ ...prev, type: 'weekly' }))}
                    className="text-primary"
                  />
                  <span>Semanal</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={schedule.type === 'monthly'}
                    onChange={() => setSchedule(prev => ({ ...prev, type: 'monthly' }))}
                    className="text-primary"
                  />
                  <span>Mensal</span>
                </label>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full pl-10 p-2 border rounded-lg"
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                )}
              </div>

              {/* Week Day Selection */}
              {schedule.type === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia da Semana
                  </label>
                  <select
                    value={schedule.weekDay}
                    onChange={(e) => setSchedule(prev => ({ 
                      ...prev, 
                      weekDay: parseInt(e.target.value) 
                    }))}
                    className={`w-full p-2 border rounded-lg ${errors.weekDay ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione um dia</option>
                    {weekDays.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                  {errors.weekDay && (
                    <p className="mt-1 text-xs text-red-500">{errors.weekDay}</p>
                  )}
                </div>
              )}

              {/* Month Day Selection */}
              {schedule.type === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia do Mês
                  </label>
                  <select
                    value={schedule.monthDay}
                    onChange={(e) => setSchedule(prev => ({ 
                      ...prev, 
                      monthDay: parseInt(e.target.value) 
                    }))}
                    className={`w-full p-2 border rounded-lg ${errors.monthDay ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione um dia</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  {errors.monthDay && (
                    <p className="mt-1 text-xs text-red-500">{errors.monthDay}</p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-2">
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
  );
}