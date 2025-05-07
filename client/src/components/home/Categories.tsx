import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category } from '@shared/schema';

export default function Categories() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop/${category.slug}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-sm bg-white transition duration-300 group-hover:shadow-md">
        <div className="aspect-square bg-gray-100">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-medium text-gray-800 group-hover:text-primary transition">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}
