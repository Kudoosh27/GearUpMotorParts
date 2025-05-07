import { CheckCheck, Truck, HeadphonesIcon, RefreshCw, MapPin, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StoreInfo() {
  return (
    <section className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold font-montserrat mb-4">Your Motorcycle Deserves the Best</h2>
            <p className="text-lg mb-6 text-neutral/90">
              At GearUp Auto Parts, we're passionate about motorcycles. With over 20 years of experience, we provide premium parts and exceptional service to keep your ride performing at its best.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <CheckCheck className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Quality Guaranteed</h3>
                  <p className="text-sm text-neutral/80">All products are tested and certified for quality</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Fast Shipping</h3>
                  <p className="text-sm text-neutral/80">Free shipping on orders over ₱4,999</p>
                </div>
              </div>
              <div className="flex items-start">
                <HeadphonesIcon className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Expert Support</h3>
                  <p className="text-sm text-neutral/80">Technical help from motorcycle enthusiasts</p>
                </div>
              </div>
              <div className="flex items-start">
                <RefreshCw className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Easy Returns</h3>
                  <p className="text-sm text-neutral/80">30-day hassle-free return policy</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4 mb-8">
              <div className="flex items-start">
                <MapPin className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Our Location</h3>
                  <p className="text-sm text-neutral/80">Km. 68, Camanchiles, Matanao Davao del Sur 8003, Philippines</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Store Hours</h3>
                  <p className="text-sm text-neutral/80">Open Sunday to Friday: 8:00 AM - 6:00 PM</p>
                  <p className="text-sm text-neutral/80">Closed on Saturdays</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="text-accent text-2xl mr-3 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Contact Us</h3>
                  <p className="text-sm text-neutral/80">pacatangjox27@gmail.com</p>
                  <p className="text-sm text-neutral/80">rovelynjoyreveche6@gmail.com</p>
                </div>
              </div>
            </div>
            
            <Button variant="accent" size="lg">
              Visit Our Store
            </Button>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://pixabay.com/get/gbc15036f5f016bcdb69d00039954e1e72672fb5c231d709d1c51028da19e15cd07b9028c9c6333734d809dad9e18ba9ecb69b0321ef0992db9bbf6be5d212fa6_1280.jpg" 
              alt="GearUp Auto Parts Store Interior" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
