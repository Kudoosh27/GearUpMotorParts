import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  User, 
  ShoppingCart, 
  ChevronDown, 
  Menu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MobileMenu from './MobileMenu';
import MiniCart from './MiniCart';
import { Category } from '@shared/schema';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Handle scroll event for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 animate-slideDown shadow-md' : 'relative'} bg-white`}>
      {/* Top Bar */}
      <div className="bg-secondary text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-neutral transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find a Store
            </a>
            <a href="#" className="hover:text-neutral transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (888) 555-0123
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-neutral transition">Track Order</a>
            <a href="#" className="hover:text-neutral transition">Help</a>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold font-montserrat text-secondary flex items-center">
            <img src="/assets/images/categories/image_1747203364257.png" alt="GearUp Logo" className="h-8 w-8 object-contain mr-2" />
            <span>GearUp <span className="text-primary">Auto Parts</span></span>
          </Link>
          
          {/* Search */}
          <div className="w-full md:w-1/2">
            <form className="relative" onSubmit={handleSearch}>
              <Input 
                type="text" 
                placeholder="Search parts, accessories, or motorcycle model..." 
                className="w-full py-2 px-4 pr-10 border border-light-3 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full text-gray-500 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          {/* Account & Cart */}
          <div className="flex items-center space-x-6">
            <Link href="/account" className="flex flex-col items-center text-gray-800 hover:text-primary transition">
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Account</span>
            </Link>
            <div className="relative group">
              <Link href="/cart" className="flex flex-col items-center text-gray-800 hover:text-primary transition">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </div>
                <span className="text-xs mt-1">Cart</span>
              </Link>
              
              {/* Mini Cart */}
              <MiniCart />
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-gray-100 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-800 py-3">
            {categories.map((category) => (
              <div key={category.id} className="group relative">
                <Link href={`/shop/${category.slug}`} className="flex items-center hover:text-primary transition">
                  {category.name}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <div className="absolute left-0 top-full w-60 bg-white shadow-lg z-20 hidden group-hover:block rounded-b-lg">
                  <div className="p-4">
                    <Link href={`/shop/${category.slug}`} className="block py-1 font-medium text-primary transition">
                      View All {category.name} Products
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/shop/deals" className="text-primary font-semibold hover:text-primary/80 transition">Deals</Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden py-3 flex justify-between items-center">
            <Button 
              variant="ghost" 
              className="text-gray-800 hover:text-primary p-1" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/shop/deals" className="text-primary font-semibold hover:text-primary/80 transition">Deals</Link>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu 
          categories={categories} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </header>
  );
}
