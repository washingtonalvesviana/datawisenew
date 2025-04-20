import React, { useState } from 'react';
import { DatabaseSelector } from './database-selector';
import { SchemaViewer } from './schema-viewer';
import { Scheduling } from './scheduling';
import { MigrationControls } from './migration-controls';
import { Database, ArrowRight, X } from 'lucide-react';
import type { DatabaseConnection, DatabaseSchema } from './types';
import type { Migration } from '../../../types/services';

interface MigrationModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Migration | null;
}

export function MigrationModal({ onClose, onSubmit, initialData }: MigrationModalProps) {
  const [sourceDb, setSourceDb] = useState<DatabaseConnection | null>(
    initialData ? {
      id: initialData.sourceDb.id,
      name: initialData.sourceDb.name,
      type: initialData.sourceDb.type,
      host: initialData.sourceDb.host,
      size: initialData.sourceDb.size,
      recordCount: initialData.stats.records,
      schemas: []
    } : null
  );
  const [targetDb, setTargetDb] = useState<DatabaseConnection | null>(
    initialData ? {
      id: initialData.targetDb.id,
      name: initialData.targetDb.name,
      type: initialData.targetDb.type,
      host: initialData.targetDb.host,
      size: initialData.targetDb.size,
      recordCount: 0,
      schemas: []
    } : null
  );
  const [selectedSchemas, setSelectedSchemas] = useState<Record<string, boolean>>({});
  const [scheduleType, setScheduleType] = useState<'now' | 'date' | 'weekly'>(
    initialData?.scheduledFor ? 'date' : 'now'
  );
  const [scheduleDate, setScheduleDate] = useState<string>(
    initialData?.scheduledFor?.split(' ')[0] || ''
  );
  const [scheduleTime, setScheduleTime] = useState<string>(
    initialData?.scheduledFor?.split(' ')[1] || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!sourceDb || !targetDb || Object.keys(selectedSchemas).length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      sourceDb,
      targetDb,
      selectedSchemas,
      scheduleType,
      scheduleDate,
      scheduleTime
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Nova Migração de Banco de Dados</h2>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Database Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Banco de Dados Origem</h3>
                <DatabaseSelector
                  value={sourceDb}
                  onChange={setSourceDb}
                  type="source"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Banco de Dados Destino</h3>
                <DatabaseSelector
                  value={targetDb}
                  onChange={setTargetDb}
                  type="target"
                />
              </div>
            </div>

            {/* Schema Selection */}
            {sourceDb && targetDb && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seleção de Schemas</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SchemaViewer
                    database={sourceDb}
                    selectedSchemas={selectedSchemas}
                    onSchemaSelect={setSelectedSchemas}
                  />
                </div>
              </div>
            )}

            {/* Scheduling */}
            <Scheduling
              type={scheduleType}
              date={scheduleDate}
              time={scheduleTime}
              onTypeChange={setScheduleType}
              onDateChange={setScheduleDate}
              onTimeChange={setScheduleTime}
            />

            {/* Controls */}
            <MigrationControls />
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
              type="submit"
              onClick={handleSubmit}
              className="btn-primary text-[#F45E41] hover:text-[#F45E41]/80"
            >
              {initialData ? 'Atualizar Migração' : 'Iniciar Migração'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}