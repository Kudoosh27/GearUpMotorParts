import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative">
      <div className="aspect-[16/9] md:aspect-[21/9] bg-cover bg-center" style={{ backgroundImage: `url('https://pixabay.com/get/g31e542038302c34dafaf4c48a2c4767ee7b77c0ea2e4cf8a92359fe2eee0be4556771b899d0c8162e51d4919f7dfb6ffcf27fd384b11bc601a1231be76e31fc7_1280.jpg')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4">
                Premium Parts for Your Ride
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Find the perfect parts and accessories to keep your motorcycle performing at its best.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button variant="default" size="lg" className="font-medium">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/vehicle-finder">
                  <Button variant="whiteOutline" size="lg" className="font-medium">
                    Find by Motorcycle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
