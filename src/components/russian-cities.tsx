'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const cities = [
  { name: 'Moscow', imageId: 'city-moscow' },
  { name: 'Saint Petersburg', imageId: 'city-st-petersburg' },
  { name: 'Kazan', imageId: 'city-kazan' },
  { name: 'Novosibirsk', imageId: 'city-novosibirsk' },
  { name: 'Yekaterinburg', imageId: 'city-yekaterinburg' },
  { name: 'Sochi', imageId: 'city-sochi' },
];

const cityData = cities.map(city => {
    const imageData = PlaceHolderImages.find(img => img.id === city.imageId);
    return {
        ...city,
        ...imageData
    }
});


export function RussianCities() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore Russian Cities
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Discover the vibrant culture and history of the cities where you
            can study.
          </p>
        </div>
      </div>
      <div
        className="w-full inline-flex flex-nowrap overflow-hidden 
                   [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
      >
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
          {cityData.map((city, index) => (
            <li key={`${city.name}-${index}`}>
                <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src={city.imageUrl!} 
                        alt={`A view of ${city.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={city.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white">
                          {city.name}
                      </h3>
                      <p className="text-white/90 text-sm mt-1">{city.description}</p>
                    </div>
                </div>
            </li>
          ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
          {cityData.map((city, index) => (
             <li key={`${city.name}-${index}-2`}>
                <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src={city.imageUrl!} 
                        alt={`A view of ${city.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={city.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white">
                          {city.name}
                      </h3>
                      <p className="text-white/90 text-sm mt-1">{city.description}</p>
                    </div>
                </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
