import { Link } from 'wouter';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold font-montserrat flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>GearUp <span className="text-primary">Auto Parts</span></span>
            </div>
            <p className="text-neutral/80 mb-4">
              Your one-stop shop for premium motorcycle parts and accessories. Quality products, expert advice, fast shipping.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral hover:text-white transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-neutral/80">
              <li><Link href="/shop/engine-parts" className="hover:text-white transition">Engine Parts</Link></li>
              <li><Link href="/shop/brake-systems" className="hover:text-white transition">Brake Systems</Link></li>
              <li><Link href="/shop/suspension" className="hover:text-white transition">Suspension</Link></li>
              <li><Link href="/shop/electrical" className="hover:text-white transition">Electrical</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-white transition">Accessories</Link></li>
              <li><Link href="/shop/maintenance" className="hover:text-white transition">Maintenance</Link></li>
              <li><Link href="/shop/deals" className="hover:text-white transition">Special Offers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Help & Info</h3>
            <ul className="space-y-2 text-neutral/80">
              <li><Link href="/account" className="hover:text-white transition">My Account</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition">Track My Order</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-neutral/80">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>123 Motor Avenue, Bike City, BC 12345</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>(888) 555-0123</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>support@gearupautoparts.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>Mon-Fri: 9AM-6PM<br/>Sat: 10AM-4PM<br/>Sun: Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-neutral/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral/70 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GearUp Auto Parts. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-sm text-neutral/70 hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-sm text-neutral/70 hover:text-white transition">Terms of Service</Link>
              <Link href="/sitemap" className="text-sm text-neutral/70 hover:text-white transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
