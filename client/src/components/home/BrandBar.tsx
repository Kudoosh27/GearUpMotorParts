
import { Link } from 'wouter';

export default function BrandBar() {
  const brands = [
    { name: 'Honda', image: '/assets/images/categories/Honda_Logo.jpg' },
    { name: 'Yamaha', image: '/assets/images/categories/yamaha logo.jpg' },
    { name: 'Kawasaki', image: '/assets/images/categories/kawasaki.png' },
    { name: 'Suzuki', image: '/assets/images/categories/suzuki.png' },
    { name: 'Rusi', image: '/assets/images/categories/images (16).png' },
  ];

  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl text-center font-medium mb-6">Top Motorcycle Brands We Carry</h2>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {brands.map((brand, index) => (
            <Link 
              key={index}
              href={`/shop?brand=${brand.name.toLowerCase()}`}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <img 
                src={brand.image} 
                alt={`${brand.name} Logo`} 
                className="h-12 w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
