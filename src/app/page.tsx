'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, Plane, School, Building, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { CountUp } from '@/components/count-up';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Step01Icon, Step02Icon, Step03Icon, Step04Icon } from '@/components/icons/steps';
import { StickyScroll } from '@/components/sticky-scroll';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
  {
    icon: CheckCircle,
    value: '98',
    suffix: '%',
    label: 'Visa Success Rate',
  },
  {
    icon: Users,
    value: '1200',
    suffix: '+',
    label: 'Students Enrolled',
  },
  {
    icon: Building,
    value: '50',
    suffix: '+',
    label: 'Partner Universities',
  },
    {
    icon: Plane,
    value: '1000',
    suffix: '+',
    label: 'Airport Receptions',
  },
];

const cityImageIds = [
    'city-moscow',
    'city-st-petersburg',
    'city-kazan',
    'city-novosibirsk',
    'city-yekaterinburg',
    'city-sochi',
];

const cities = cityImageIds.map(id => {
    const imageData = PlaceHolderImages.find(img => img.id === id);
    return {
        name: id.split('-')[1].charAt(0).toUpperCase() + id.split('-')[1].slice(1).replace('st-petersburg', 'St. Petersburg'),
        description: imageData?.description,
        imageUrl: imageData?.imageUrl!,
        imageHint: imageData?.imageHint!,
    }
});

const faqData = [
  {
    value: 'education',
    title: 'Education in Russia',
    questions: [
      {
        question: "What training programs are available to me?",
        answer: "Russian universities offer a wide range of programs including Bachelor's, Master's, and PhD degrees, as well as preparatory language courses. Popular fields include medicine, engineering, computer science, and natural sciences."
      },
      {
        question: "What language is taught in Russia?",
        answer: "While the primary language of instruction is Russian, many universities offer programs fully taught in English, especially at the Master's level. Preparatory courses are available to help you learn Russian before starting your main program."
      },
      {
        question: "What forms of education are available in Russia?",
        answer: "You can choose between full-time (on-campus), part-time, and online (distance learning) forms of education, depending on the university and program."
      },
      {
        question: "Can foreign students study in Russia for free?",
        answer: "Yes, it is possible. The Russian government offers a limited number of scholarships (quotas) for foreign students each year, which cover tuition fees and provide a small monthly stipend. Competition for these scholarships is high."
      },
      {
        question: "How much does it cost to study in Russia?",
        answer: "Tuition fees are affordable compared to many Western countries, ranging from $2,000 to $8,000 per year for Bachelor's programs. Living costs are also relatively low, especially outside of major cities like Moscow and St. Petersburg."
      }
    ]
  },
  {
    value: 'admission',
    title: 'Admission Procedure',
    questions: [
        {
            question: "What are the general admission requirements?",
            answer: "Generally, you need a completed secondary education certificate for a Bachelor's program, and a Bachelor's degree for a Master's program. Some universities may require entrance exams or an interview."
        },
        {
            question: "When should I start my application?",
            answer: "It is best to start the application process at least 6-8 months before the start of the academic year (which is typically September 1st). This allows enough time for securing the invitation, applying for a visa, and preparing for travel."
        },
    ]
  },
  {
    value: 'moving',
    title: 'Moving to Russia',
    questions: [
        {
            question: "What should I pack?",
            answer: "Pack for all seasons, especially warm winter clothing. Also bring any necessary prescription medications, important documents, and adapters for European-style power outlets (Type C and F)."
        },
        {
            question: "What is student accommodation like?",
            answer: "Most universities provide student dormitories (общежитие), which are the most affordable option. Rooms are typically shared between 2-4 students. You can also rent a private apartment, which is more expensive."
        }
    ]
  },
  {
    value: 'learning',
    title: 'Learning Process',
    questions: [
        {
            question: "What is the academic calendar?",
            answer: "The academic year typically runs from September 1st to the end of June, divided into two semesters. There is a winter break in January/February and a summer break in July/August."
        },
        {
            question: "How are courses graded?",
            answer: "Russia uses a 5-point grading system, where 5 is 'excellent', 4 is 'good', 3 is 'satisfactory', and 2 is 'fail'."
        }
    ]
  }
];

const content = [
  {
    title: 'Submit an Application',
    description: (
      <ul className="space-y-2">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Complete the online application form with your personal and educational details.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Prepare and submit all required documents including transcripts and passport copies.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Our team will review your application and contact you within 3 business days.</span>
        </li>
      </ul>
    ),
    icon: <Step01Icon className="w-10 h-10" />
  },
  {
    title: 'Receive an Invitation',
    description: (
      <ul className="space-y-2">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Once approved, you'll receive an official invitation letter from the Russian university.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>This invitation is your key document for the visa application process.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>The invitation typically arrives within 2-4 weeks after application approval.</span>
        </li>
      </ul>
    ),
    icon: <Step02Icon className="w-10 h-10" />
  },
  {
    title: 'Get Your Student Visa',
    description: (
      <ul className="space-y-2">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Apply for a student visa at the nearest Russian embassy or consulate.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Complete medical examination and obtain health insurance as required.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Book your flight to Russia after receiving your visa.</span>
        </li>
      </ul>
    ),
    icon: <Step03Icon className="w-10 h-10" />
  },
  {
    title: 'Arrive and Start Studying',
    description: (
      <ul className="space-y-2">
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Once you receive a student visa, you can plan your arrival to the university.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>We'll help you arrange accommodation and get settled in your new city.</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
          <span>Begin your exciting educational journey in Russia!</span>
        </li>
      </ul>
    ),
    icon: <Step04Icon className="w-10 h-10" />
  },
];


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
};
  
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
};


export default function Home() {
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 });
  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.5 });
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          key="hero-video"
        >
          <source src="/videos/St Basil Cathedral in Russia - Free Stock Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/60"></div>
        <motion.div 
          className="z-20 text-center px-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Your Journey to a Russian University Begins Here
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
            Study In Russia 200 provides comprehensive support for international students, from application to arrival.
          </p>
          <div className="mt-8 flex justify-center">
            {/* <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/application">Apply Now</Link>
            </Button> */}
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Comprehensive Services</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              We handle every detail of your journey, ensuring a seamless and stress-free experience.
            </p>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            ref={servicesRef}
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5, transition: { type: 'spring', stiffness: 300 } }}
              >
              <Card className="text-center h-full">
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sticky Scroll Section */}
      <StickyScroll content={content} />

      {/* Success Metrics Section */}
      <section className="py-16 lg:py-24 bg-secondary">
          <div className="container">
              <div className="text-center space-y-4 mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Our Track Record of Success</h2>
                  <p className="max-w-2xl mx-auto text-muted-foreground">
                      We are proud of the results we deliver and the students we've helped.
                  </p>
              </div>
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
                ref={metricsRef}
                variants={containerVariants}
                initial="hidden"
                animate={metricsInView ? "visible" : "hidden"}
              >
                  {metrics.map((metric) => (
                      <motion.div key={metric.label} variants={itemVariants} className="flex flex-col items-center">
                          <metric.icon className="h-10 w-10 text-primary mb-3" />
                          <div className="text-4xl md:text-5xl font-bold">
                            <CountUp 
                              to={metricsInView ? metric.value : '0'}
                              duration={2}
                              suffix={metric.suffix}
                            />
                          </div>
                          <p className="mt-2 text-muted-foreground">{metric.label}</p>
                      </motion.div>
                  ))}
              </motion.div>
          </div>
      </section>

      {/* Russian Cities Section */}
      <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore Russian Cities
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Discover the vibrant culture and history of the cities where you can study.
          </p>
        </div>
      </div>
      <div
        className="w-full inline-flex flex-nowrap overflow-hidden 
                   [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
      >
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
          {cities.map((city, index) => (
            <li key={`${city.name}-${index}`}>
                <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src={city.imageUrl} 
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
          {cities.map((city, index) => (
             <li key={`${city.name}-${index}-2`}>
                <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src={city.imageUrl} 
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

      {/* FAQ Section */}
<section id="faq" className="py-16 lg:py-24 bg-secondary">
  <div className="container">
    <Tabs defaultValue={faqData[0]?.value} className="h-full grid grid-cols-1 md:grid-cols-3 gap-0 relative">
      <div className="col-span-1 bg-gradient-to-br from-primary to-blue-800 text-primary-foreground p-8 z-0 h-full rounded-l-lg">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <TabsList className="flex flex-col h-auto bg-transparent items-start p-0">
          {faqData.map((category) => (
              <TabsTrigger
              key={category.value}
              value={category.value}
              className="w-full text-left justify-start p-4 rounded-md text-base data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=inactive]:hover:bg-primary-foreground/10 data-[state=inactive]:text-primary-foreground/80"
              >
              {category.title}
              </TabsTrigger>
          ))}
          </TabsList>
      </div>

      <div className="col-span-2 bg-card p-8 rounded-r-lg relative md:-ml-10 z-10 h-full shadow-lg">
           <div className="pl-0 md:pl-6 h-full">
          {faqData.map((category) => (
              <TabsContent key={category.value} value={category.value} className="h-full mt-0">
                  <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                  <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`} className="border-b">
                          <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                              {item.answer}
                          </AccordionContent>
                          </AccordionItem>
                      ))}
                  </Accordion>
              </TabsContent>
          ))}
          </div>
      </div>
    </Tabs>
  </div>
</section>

    </>
  );
}
