import { useQuery } from '@tanstack/react-query';
import { Star, StarHalf } from 'lucide-react';
import { Testimonial } from '@shared/schema';

export default function Testimonials() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-center mb-8">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-accent text-accent" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-accent/30" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex mb-3">
        {renderStars(testimonial.rating)}
      </div>
      <p className="italic mb-4 text-gray-600">
        "{testimonial.text}"
      </p>
      <div className="flex items-center">
        <div className="mr-3 w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium">{testimonial.name}</div>
          <div className="text-xs text-gray-600">{testimonial.bikeModel}</div>
        </div>
      </div>
    </div>
  );
}
