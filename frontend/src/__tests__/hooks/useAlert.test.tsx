import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlert } from '../../hooks/useAlert';

describe('useAlert Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAlert());
    
    expect(result.current.alert).toEqual({
      type: 'info',
      message: '',
      isOpen: false,
    });
  });

  it('should show alert with correct values', () => {
    const { result } = renderHook(() => useAlert());
    
    act(() => {
      result.current.showAlert('success', 'Test message', 'Test title');
    });
    
    expect(result.current.alert).toEqual({
      type: 'success',
      title: 'Test title',
      message: 'Test message',
      isOpen: true,
    });
  });

  it('should show alert without title', () => {
    const { result } = renderHook(() => useAlert());
    
    act(() => {
      result.current.showAlert('error', 'Error message');
    });
    
    expect(result.current.alert).toEqual({
      type: 'error',
      title: undefined,
      message: 'Error message',
      isOpen: true,
    });
  });

  it('should hide alert', () => {
    const { result } = renderHook(() => useAlert());
    
    // Primeiro mostra o alerta
    act(() => {
      result.current.showAlert('warning', 'Warning message');
    });
    
    expect(result.current.alert.isOpen).toBe(true);
    
    // Depois esconde o alerta
    act(() => {
      result.current.hideAlert();
    });
    
    // Verifica que isOpen mudou para false mas mantém outras propriedades
    expect(result.current.alert).toEqual({
      type: 'warning',
      message: 'Warning message',
      title: undefined,
      isOpen: false,
    });
  });
});