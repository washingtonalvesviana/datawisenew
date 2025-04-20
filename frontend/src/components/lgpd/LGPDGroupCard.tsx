import React from 'react';
import { Users, Shield, FileText } from 'lucide-react';
import type { LGPDGroup } from '../../types/lgpd';

interface LGPDGroupCardProps {
  group: LGPDGroup;
}

export function LGPDGroupCard({ group }: LGPDGroupCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h4 className="font-medium">{group.name}</h4>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Permissões</p>
          <div className="space-y-2">
            {group.permissions.map((permission, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-600">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Responsabilidades</p>
          <div className="space-y-2">
            {group.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                <span className="text-sm text-gray-600">{responsibility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}