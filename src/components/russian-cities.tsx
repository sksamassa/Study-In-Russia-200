'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/i18n/get-dictionary';


const cityImageIds = [
    'city-moscow',
    'city-st-petersburg',
    'city-kazan',
    'city-novosibirsk',
    'city-yekaterinburg',
    'city-sochi',
];


export function RussianCities({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['cities'] }) {
    const cityData = cityImageIds.map(id => {
        const imageData = PlaceHolderImages.find(img => img.id === id);
        const cityDict = dictionary.items[id as keyof typeof dictionary.items];
        return {
            name: cityDict.name,
            description: cityDict.description,
            imageUrl: imageData?.imageUrl!,
            imageHint: imageData?.imageHint!,
        }
    });

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {dictionary.title}
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            {dictionary.description}
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
                        sizes="(max-width: 768px) 100vw, 400px"
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
                        sizes="(max-width: 768px) 100vw, 400px"
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
