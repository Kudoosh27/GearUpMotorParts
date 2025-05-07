import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You're now subscribed to our newsletter",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-10 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold font-montserrat mb-3">Stay Updated</h2>
          <p className="mb-6">Subscribe to get exclusive deals, new product announcements, and expert riding tips.</p>
          <form 
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            onSubmit={handleSubmit}
          >
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 py-3 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              variant="secondary" 
              className="font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-xs mt-4 text-white/80">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from GearUp Auto Parts.
          </p>
        </div>
      </div>
    </section>
  );
}
