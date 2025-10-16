
'use client';

import { CountUp } from '@/components/count-up';
import { getDictionary } from '@/i18n/get-dictionary';
import { Building, CheckCircle, Plane, Users } from 'lucide-react';

const metrics = [
  {
    icon: CheckCircle,
    value: '98',
    suffix: '%',
    labelKey: 'visaSuccessRate',
  },
  {
    icon: Users,
    value: '1200',
    suffix: '+',
    labelKey: 'studentsEnrolled',
  },
  {
    icon: Building,
    value: '50',
    suffix: '+',
    labelKey: 'partnerUniversities',
  },
    {
    icon: Plane,
    value: '1000',
    suffix: '+',
    labelKey: 'airportReceptions',
  },
];

export function Metrics({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['metrics'] }) {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{dictionary.title}</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            {dictionary.description}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {metrics.map((metric) => (
            <div key={metric.labelKey} className="flex flex-col items-center">
              <metric.icon className="h-10 w-10 text-primary mb-3" />
              <div className="text-4xl md:text-5xl font-bold">
                <CountUp to={metric.value} suffix={metric.suffix} />
              </div>
              <p className="text-muted-foreground mt-2">{dictionary.items[metric.labelKey as keyof typeof dictionary.items]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
