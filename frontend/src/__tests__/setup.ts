import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';

// Estende os matchers do Vitest com os matchers do testing-library
expect.extend(matchers);

// Adiciona declaração de tipos global para os matchers do jest-dom
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toBeVisible(): T;
    toHaveTextContent(text: string): T;
    toHaveClass(className: string): T;
  }
}

// Executa o cleanup após cada teste
afterEach(() => {
  cleanup();
});