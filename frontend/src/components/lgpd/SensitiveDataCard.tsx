import React from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import type { SensitiveData } from '../../types/lgpd';

interface SensitiveDataCardProps {
  data: SensitiveData;
}

export function SensitiveDataCard({ data }: SensitiveDataCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="w-5 h-5 text-red-500" />
        <h4 className="font-medium text-red-700">{data.category}</h4>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Requisitos de Tratamento</p>
          <div className="space-y-2">
            {data.handlingRequirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-sm text-gray-600">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Medidas de Segurança</p>
          <div className="space-y-2">
            {data.securityMeasures.map((measure, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Lock className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-600">{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}