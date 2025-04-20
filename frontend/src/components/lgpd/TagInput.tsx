import React from 'react';
import { Tag, X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function TagInput({ tags, onAdd, onRemove }: TagInputProps) {
  const [newTag, setNewTag] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      onAdd(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma tag e pressione Enter"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}