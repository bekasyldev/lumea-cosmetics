import { ArrowRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  title: string;
  imageUrl: string;
  path: string;
  size: 'normal' | 'large';
}

interface CatalogSectionProps {
  title?: string;
  categories: CategoryItem[];
}

export default function CatalogSection({ title = 'Каталог товаров', categories }: CatalogSectionProps) {
  // Helper to find category by ID
  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  
  return (
    <section className="container mx-auto my-12 px-4">
      <h2 className="text-3xl font-medium text-[#33333D] mb-8">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* First row */}
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('skin-care')} />
        </div>
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('hair-care')} />
        </div>
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('makeup')} />
        </div>
        <div className="md:col-span-6">
          <CategoryCard category={getCategoryById('cosmetics')} aspectRatio="aspect-[2/1]" />
        </div>
        
        {/* Second row */}
        <div className="md:col-span-6">
          <CategoryCard category={getCategoryById('fragrances')} aspectRatio="aspect-[2/1]" />
        </div>
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('oral-care')} />
        </div>
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('hygiene')} />
        </div>
        <div className="md:col-span-2">
          <CategoryCard category={getCategoryById('sets')} />
        </div>
      </div>
    </section>
  );
}

type CategoryCardProps = {
  category?: CategoryItem;
  aspectRatio?: string;
}

function CategoryCard({ category, aspectRatio = "aspect-square" }: CategoryCardProps) {
  if (!category) return null;
  
  return (
    <a 
      href={category.path}
      className="relative rounded-2xl overflow-hidden group hover:opacity-95 transition-opacity block h-full"
    >
      <div className={`${aspectRatio} h-full w-full`}>
        <img 
          src={category.imageUrl} 
          alt={category.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
        <div className="flex items-center justify-between">
          <span className="font-medium">{category.title}</span>
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}