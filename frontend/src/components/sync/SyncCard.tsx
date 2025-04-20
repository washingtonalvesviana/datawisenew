import React from 'react';
import { RefreshCw, Activity, Settings, AlertTriangle, CheckCircle2, XCircle, Database, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import type { SyncTask } from '../../types/sync';

interface SyncCardProps {
  sync: SyncTask;
  onEdit: (sync: SyncTask) => void;
  onDelete: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onMonitor: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function SyncCard({
  sync,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onMonitor,
  onConfigure
}: SyncCardProps) {
  // Early return if sync is undefined
  if (!sync) return null;

  const getStatusColor = (status: SyncTask['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: SyncTask['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-red-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-gray-900">{sync.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs ${
              sync.type === 'bidirectional' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {sync.type === 'bidirectional' ? 'Bidirecional' : 'Unidirecional'}
            </div>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {sync.frequency}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{sync.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(sync)}
            className="p-1 text-gray-500 hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(sync.id)}
            className="p-1 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Source and Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Source System */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Sistema Origem</h4>
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{sync.source.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{sync.source.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Endpoint:</span>
              <span className="font-medium">{sync.source.endpoint}</span>
            </div>
          </div>
        </div>

        {/* Target System */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Sistema Destino</h4>
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium">{sync.target.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{sync.target.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Endpoint:</span>
              <span className="font-medium">{sync.target.endpoint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Métricas</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Taxa de Sucesso</span>
              <span className={`text-sm font-medium ${getMetricColor(sync.metrics.successRate)}`}>
                {sync.metrics.successRate}%
              </span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  sync.metrics.successRate >= 90 ? 'bg-green-500' :
                  sync.metrics.successRate >= 75 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${sync.metrics.successRate}%` }}
              />
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Latência</p>
            <p className="font-medium">{sync.metrics.latency}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Registros</p>
            <p className="font-medium">{sync.metrics.recordsProcessed.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <p className="font-medium">{sync.metrics.dataVolume}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Erros</p>
            <p className="font-medium text-red-600">{sync.metrics.errors}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Alertas</p>
            <p className="font-medium text-yellow-600">{sync.metrics.warnings}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {sync.lastSync && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Última Sincronização: {sync.lastSync}</span>
            </div>
          )}
          {sync.nextSync && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Próxima Sincronização: {sync.nextSync}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-2">
        {sync.status === 'active' ? (
          <button 
            onClick={() => onPause(sync.id)}
            className="btn-secondary flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Pausar</span>
          </button>
        ) : (
          <button 
            onClick={() => onResume(sync.id)}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retomar</span>
          </button>
        )}
        <button 
          onClick={() => onMonitor(sync.id)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Activity className="w-4 h-4" />
          <span>Monitorar</span>
        </button>
        <button 
          onClick={() => onConfigure(sync.id)}
          className="btn-primary flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Configurar</span>
        </button>
      </div>
    </div>
  );
}