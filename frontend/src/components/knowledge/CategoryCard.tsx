import React from 'react';
import { Category } from '../../types/knowledge';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  return (
    <button
      onClick={() => onSelect(category.id)}
      className={`p-4 rounded-lg border text-left transition-colors ${
        isSelected
          ? 'bg-primary/5 border-primary'
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
    >
      <div className="text-2xl mb-2">{category.icon}</div>
      <h3 className="font-medium text-gray-900">{category.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
      <p className="text-sm text-gray-500 mt-2">{category.modules} módulos</p>
    </button>
  );
}