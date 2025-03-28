
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { eventCategories } from '@/data/mockData';
import { EventCategory } from '@/types';

interface CategoryFilterProps {
  selectedCategory: EventCategory | null;
  onSelectCategory: (category: EventCategory | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleCategoryClick = (category: EventCategory | null) => {
    if (category === 'party') {
      // Only navigate if we're not already on the house-parties page
      if (location.pathname !== '/house-parties') {
        navigate('/house-parties');
      } else {
        // If we're already on the house-parties page, just update the filter
        onSelectCategory(category);
      }
    } else {
      onSelectCategory(category);
    }
  };
  
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="flex items-center gap-1 rounded-full"
          onClick={() => handleCategoryClick(null)}
        >
          <span className="text-lg">✨</span>
          <span>All</span>
        </Button>
        
        {eventCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="flex items-center gap-1 rounded-full"
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
};

export default CategoryFilter;
