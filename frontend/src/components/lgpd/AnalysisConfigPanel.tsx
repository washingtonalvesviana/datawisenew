import React from 'react';
import type { LGPDAnalysisConfig } from '../../types/lgpd';

interface AnalysisConfigPanelProps {
  config: LGPDAnalysisConfig;
  onChange: (config: LGPDAnalysisConfig) => void;
}

export function AnalysisConfigPanel({ config, onChange }: AnalysisConfigPanelProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-4">Configurações da Análise</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sensibilidade da Análise
          </label>
          <select
            value={config.sensitivity}
            onChange={(e) => onChange({ 
              ...config, 
              sensitivity: e.target.value as LGPDAnalysisConfig['sensitivity']
            })}
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
              checked={config.includeContext}
              onChange={(e) => onChange({
                ...config,
                includeContext: e.target.checked
              })}
            />
            <span className="text-sm">Incluir contexto dos dados</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.identifyPatterns}
              onChange={(e) => onChange({
                ...config,
                identifyPatterns: e.target.checked
              })}
            />
            <span className="text-sm">Identificar padrões de dados</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.checkCompliance}
              onChange={(e) => onChange({
                ...config,
                checkCompliance: e.target.checked
              })}
            />
            <span className="text-sm">Verificar conformidade LGPD</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.generateRecommendations}
              onChange={(e) => onChange({
                ...config,
                generateRecommendations: e.target.checked
              })}
            />
            <span className="text-sm">Gerar recomendações</span>
          </label>
        </div>
      </div>
    </div>
  );
}