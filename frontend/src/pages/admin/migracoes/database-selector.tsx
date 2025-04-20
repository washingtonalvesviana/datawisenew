import React from 'react';
import { Database, Server, HardDrive, Files } from 'lucide-react';
import type { DatabaseConnection, DatabaseSchema } from './types';

interface DatabaseSelectorProps {
  value: DatabaseConnection | null;
  onChange: (db: DatabaseConnection) => void;
  type: 'source' | 'target';
}

// Mock database connections
const mockConnections: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Banco de Dados de Produção',
    type: 'postgres',
    host: 'db.production.com',
    size: '2.5 TB',
    recordCount: 15000000,
    schemas: [
      {
        name: 'public',
        tables: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'uuid', nullable: false, isPrimary: true },
              { name: 'name', type: 'text', nullable: false, isPrimary: false },
              { name: 'email', type: 'text', nullable: false, isPrimary: false }
            ],
            recordCount: 10000
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Banco de Dados Analítico',
    type: 'mysql',
    host: 'analytics.db.com',
    size: '800 GB',
    recordCount: 5000000,
    schemas: [
      {
        name: 'analytics',
        tables: [
          {
            name: 'events',
            columns: [
              { name: 'id', type: 'int', nullable: false, isPrimary: true },
              { name: 'type', type: 'varchar', nullable: false, isPrimary: false },
              { name: 'data', type: 'json', nullable: true, isPrimary: false }
            ],
            recordCount: 50000
          }
        ]
      }
    ]
  }
];

export function DatabaseSelector({ value, onChange, type }: DatabaseSelectorProps) {
  return (
    <div className="space-y-4">
      <select
        value={value?.id || ''}
        onChange={(e) => {
          const db = mockConnections.find(c => c.id === e.target.value);
          if (db) onChange(db);
        }}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Selecione um banco de dados</option>
        {mockConnections.map((db) => (
          <option key={db.id} value={db.id}>
            {db.name} ({db.host})
          </option>
        ))}
      </select>

      {value && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Host</p>
                <p className="font-medium">{value.host}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tamanho</p>
                <p className="font-medium">{value.size}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Schemas</p>
                <p className="font-medium">{value.schemas.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tabelas</p>
                <p className="font-medium">
                  {value.schemas.reduce((acc, schema) => acc + schema.tables.length, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Files className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Registros</p>
                <p className="font-medium">{value.recordCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}