import React from 'react';
import { Bot, Edit, Trash2, AlertTriangle, CheckCircle2, XCircle, Settings, Clock } from 'lucide-react';
import type { AIAgent } from '../../types/ai';

interface AIAgentCardProps {
  agent: AIAgent;
  onEdit: (agent: AIAgent) => void;
  onDelete: (id: string) => void;
}

export function AIAgentCard({ agent, onEdit, onDelete }: AIAgentCardProps) {
  const getStatusColor = (status: AIAgent['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'configuring':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: AIAgent['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'configuring':
        return <Settings className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <span className="text-sm text-gray-500">v{agent.version}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
          {getStatusIcon(agent.status)}
          <span className="text-xs capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Model Info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Modelo</p>
              <p className="text-sm font-medium">{agent.model}</p>
            </div>
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Último Treino</p>
              <p className="text-sm font-medium">{agent.lastTrained}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((capability, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button 
          onClick={() => onEdit(agent)}
          className="p-1 text-gray-500 hover:text-primary"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(agent.id)}
          className="p-1 text-gray-500 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}