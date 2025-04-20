import { useState } from 'react';
import type { AlertType } from '../components/Alert';

interface AlertState {
  type: AlertType;
  title?: string;
  message: string;
  isOpen: boolean;
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    type: 'info',
    message: '',
    isOpen: false,
  });

  const showAlert = (type: AlertType, message: string, title?: string) => {
    setAlert({
      type,
      title,
      message,
      isOpen: true,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  return {
    alert,
    showAlert,
    hideAlert,
  };
}