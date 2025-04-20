import React from 'react';
import { Pause, StopCircle, XCircle } from 'lucide-react';

export function MigrationControls() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Controles da Migração</h3>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="btn-secondary flex items-center space-x-2"
        >
          <Pause className="w-4 h-4" />
          <span>Pausar</span>
        </button>

        <button
          type="button"
          className="btn-secondary flex items-center space-x-2"
        >
          <StopCircle className="w-4 h-4" />
          <span>Parar</span>
        </button>

        <button
          type="button"
          className="btn-secondary flex items-center space-x-2 text-red-600 hover:text-red-700"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancelar Migração</span>
        </button>
      </div>
    </div>
  );
}