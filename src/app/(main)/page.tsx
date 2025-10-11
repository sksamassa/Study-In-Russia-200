
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Plane, FileText, School, BarChart, Bot } from 'lucide-react';

const services = [
  {
    icon: School,
    title: 'Study Invitation',
    description: 'We secure your official invitation letter from your chosen university, a crucial first step in your application process.',
  },
  {
    icon: FileText,
    title: 'Visa Support',
    description: 'Our experts guide you through the complex student visa application, ensuring all forms are correctly filled and submitted.',
  },
  {
    icon: Bot,
    title: 'Document Assistance',
    description: 'From translation to legalization, we help you prepare and verify all required documents to meet university standards.',
  },
  {
    icon: Plane,
    title: 'Airport Reception',
    description: 'A warm welcome awaits you. We arrange for your pickup from the airport and transfer to your accommodation.',
  },
];

const metrics = [
    { value: "98%", label: "Visa Success Rate" },
    { value: "500+", label: "Students Enrolled" },
    { value: "50+", label: "Partner Universities" },
    { value: "100%", label: "Airport Receptions" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 z-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/853878/853878-hd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/60"></div>
        <div className="z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Your Journey to a Russian University Begins Here
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
            Global Pathways Hub provides comprehensive support for international students, from application to arrival.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard/apply">Start Your Application</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Comprehensive Services</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              We handle every detail of your journey, ensuring a seamless and stress-free experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="pt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="py-16 lg:py-24 bg-secondary">
          <div className="container">
              <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Our Track Record of Success</h2>
                  <p className="max-w-2xl mx-auto text-muted-foreground">
                      We are proud of the results we deliver and the students we've helped.
                  </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  {metrics.map((metric) => (
                      <div key={metric.label}>
                          <p className="text-5xl font-bold text-primary">{metric.value}</p>
                          <p className="mt-2 text-muted-foreground">{metric.label}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Adventure?</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Let us be your guide on the path to a world-class education in Russia. Create your account and begin your application today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard/apply">Apply Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
