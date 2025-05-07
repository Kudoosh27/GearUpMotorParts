import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandBar from '@/components/home/BrandBar';
import StoreInfo from '@/components/home/StoreInfo';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>GearUp Auto Parts - Motorcycle Parts & Accessories</title>
        <meta name="description" content="Premium motorcycle parts and accessories. Find quality engine parts, brake systems, suspension, and more for your motorcycle. Free shipping on orders over $99." />
        <meta property="og:title" content="GearUp Auto Parts - Motorcycle Parts & Accessories" />
        <meta property="og:description" content="Premium motorcycle parts and accessories for all major brands. Quality guaranteed with fast shipping and expert support." />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@300;400;500&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <BrandBar />
        <StoreInfo />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
