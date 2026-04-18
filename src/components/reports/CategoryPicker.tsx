import React from 'react';
import { motion } from 'framer-motion';
import { ISSUE_CATEGORIES } from '@/data/bbmpWards';

interface CategoryPickerProps {
  selected: string | null;
  onSelect: (category: string) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {ISSUE_CATEGORIES.map((cat, index) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(cat.id)}
          className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left group
            ${selected === cat.id
              ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
        >
          {selected === cat.id && (
            <motion.div
              layoutId="categoryCheck"
              className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          <div className="text-3xl mb-2">{cat.icon}</div>
          <h3 className={`text-sm font-semibold mb-0.5 ${selected === cat.id ? 'text-emerald-800' : 'text-gray-800'}`}>
            {cat.label}
          </h3>
          <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">{cat.description}</p>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryPicker;
