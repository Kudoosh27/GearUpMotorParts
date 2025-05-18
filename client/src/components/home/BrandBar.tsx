export default function BrandBar() {
  const brands = [
    { name: 'Honda', image: 'https://pixabay.com/get/g31e542038302c34dafaf4c48a2c4767ee7b77c0ea2e4cf8a92359fe2eee0be4556771b899d0c8162e51d4919f7dfb6ffcf27fd384b11bc601a1231be76e31fc7_1280.jpg' },
    { name: 'Yamaha', image: 'https://pixabay.com/get/g6c2ad519413b658f14e0e57d9749493778a5775601fe006239539172e28a2864868df2c102b08d9bab531b5fd569c47b4052f892bcec2fafddfe84a97a80e646_1280.jpg' },
    { name: 'Kawasaki', image: 'https://pixabay.com/get/g6c2ad519413b658f14e0e57d9749493778a5775601fe006239539172e28a2864868df2c102b08d9bab531b5fd569c47b4052f892bcec2fafddfe84a97a80e646_1280.jpg' },
    { name: 'Suzuki', image: 'https://pixabay.com/get/g637f09ad2432c52449a28f8d261787dda72d2b8c725dbed93cc052f0db5055259d96d023a59e326f472fff22fef8010e70608c9ecccd9ad8748026c70042ce01_1280.jpg' },
    { name: 'Rusi', image: 'https://pixabay.com/get/g637f09ad2432c52449a28f8d261787dda72d2b8c725dbed93cc052f0db5055259d96d023a59e326f472fff22fef8010e70608c9ecccd9ad8748026c70042ce01_1280.jpg' },
  ];

  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl text-center font-medium mb-6">Top Motorcycle Brands We Carry</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <div 
              key={index} 
              className="grayscale hover:grayscale-0 transition opacity-70 hover:opacity-100"
            >
              <img 
                src={brand.image} 
                alt={`${brand.name} Logo`} 
                className="h-8"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
