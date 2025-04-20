import { Database, FileText, Globe, FileJson, Folder } from 'lucide-react';
import type { DataSource } from '../types/knowledge';

export const getDataSourceIcon = (type: DataSource['type']) => {
  switch (type) {
    case 'database':
      return Database;
    case 'file':
      return FileText;
    case 'url':
      return Globe;
    case 'gdoc':
      return FileJson;
    case 'folder':
      return Folder;
    default:
      return FileText;
  }
};