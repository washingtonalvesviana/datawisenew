import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SchedulingProps {
  type: 'now' | 'date' | 'weekly';
  date: string;
  time: string;
  onTypeChange: (type: 'now' | 'date' | 'weekly') => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function Scheduling({
  type,
  date,
  time,
  onTypeChange,
  onDateChange,
  onTimeChange
}: SchedulingProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Agendamento</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={type === 'now'}
              onChange={() => onTypeChange('now')}
              className="text-primary"
            />
            <span>Executar Agora</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={type === 'date'}
              onChange={() => onTypeChange('date')}
              className="text-primary"
            />
            <span>Agendar para Data</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={type === 'weekly'}
              onChange={() => onTypeChange('weekly')}
              className="text-primary"
            />
            <span>Agendamento Semanal</span>
          </label>
        </div>

        {type !== 'now' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}