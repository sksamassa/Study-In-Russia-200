
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, FileText, Plane, Bot } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { StickyScroll } from '@/components/sticky-scroll';
import { RussianCities } from '@/components/russian-cities';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CountUp } from '@/components/count-up';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ApplicationForm } from '@/components/application-form';


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
    { value: "98", label: "Visa Success Rate", suffix: "%" },
    { value: "500", label: "Students Enrolled", suffix: "+" },
    { value: "50", label: "Partner Universities", suffix: "+" },
    { value: "100", label: "Airport Receptions", suffix: "%" },
];

const faqData = [
  {
    value: 'education',
    title: 'Education in Russia',
    questions: [
      {
        question: 'What training programs are available to me?',
        answer: 'Russian universities offer a wide range of programs including Bachelor\'s, Master\'s, and PhD degrees, as well as preparatory language courses. Popular fields include medicine, engineering, computer science, and natural sciences.',
      },
      {
        question: 'What language is taught in Russia?',
        answer: 'While the primary language of instruction is Russian, many universities offer programs fully taught in English, especially at the Master\'s level. Preparatory courses are available to help you learn Russian before starting your main program.',
      },
      {
        question: 'What forms of education are available in Russia?',
        answer: 'You can choose between full-time (on-campus), part-time, and online (distance learning) forms of education, depending on the university and program.',
      },
      {
        question: 'Can foreign students study in Russia for free?',
        answer: 'Yes, it is possible. The Russian government offers a limited number of scholarships (quotas) for foreign students each year, which cover tuition fees and provide a small monthly stipend. Competition for these scholarships is high.',
      },
      {
        question: 'How much does it cost to study in Russia?',
        answer: 'Tuition fees are affordable compared to many Western countries, ranging from $2,000 to $8,000 per year for Bachelor\'s programs. Living costs are also relatively low, especially outside of major cities like Moscow and St. Petersburg.',
      },
    ],
  },
  {
    value: 'admission',
    title: 'Admission Procedure',
    questions: [
      {
        question: 'What are the general admission requirements?',
        answer: 'Generally, you need a completed secondary education certificate for a Bachelor\'s program, and a Bachelor\'s degree for a Master\'s program. Some universities may require entrance exams or an interview.',
      },
      {
        question: 'When should I start my application?',
        answer: 'It is best to start the application process at least 6-8 months before the start of the academic year (which is typically September 1st). This allows enough time for securing the invitation, applying for a visa, and preparing for travel.',
      },
    ],
  },
  {
    value: 'moving',
    title: 'Moving to Russia',
    questions: [
      {
        question: 'What should I pack?',
        answer: 'Pack for all seasons, especially warm winter clothing. Also bring any necessary prescription medications, important documents, and adapters for European-style power outlets (Type C and F).',
      },
      {
        question: 'What is student accommodation like?',
        answer: 'Most universities provide student dormitories (общежитие), which are the most affordable option. Rooms are typically shared between 2-4 students. You can also rent a private apartment, which is more expensive.',
      },
    ],
  },
  {
    value: 'learning',
    title: 'Learning Process',
    questions: [
      {
        question: 'What is the academic calendar?',
        answer: 'The academic year typically runs from September 1st to the end of June, divided into two semesters. There is a winter break in January/February and a summer break in July/August.',
      },
      {
        question: 'How are courses graded?',
        answer: 'Russia uses a 5-point grading system, where 5 is "excellent", 4 is "good", 3 is "satisfactory", and 2 is "fail".',
      },
    ],
  },
];


export default function Home() {
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 });

  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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


  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8 py-6">Apply Now</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">University Application</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to start your application. Our team will verify your documents using AI.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
                  <ApplicationForm />
                </div>
              </DialogContent>
            </Dialog>
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

      <StickyScroll />

      {/* Success Metrics Section */}
      <section className="py-16 lg:py-24 bg-background">
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
                      <motion.div key={metric.label} variants={itemVariants}>
                          <div className="text-5xl font-bold text-primary">
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
      
      <RussianCities />

      {/* FAQ Section */}
<section id="faq" className="min-h-screen flex items-stretch bg-background">
  <div className="container flex-1 py-16 lg:py-24">
    <Tabs defaultValue="education" className="h-full grid grid-cols-1 md:grid-cols-3 gap-0 relative">
      <div className="col-span-1 bg-gradient-to-br from-primary to-blue-800 text-primary-foreground p-8 z-0 h-full">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <TabsList className="flex flex-col h-auto bg-transparent items-start p-0">
          {faqData.map((category) => (
              <TabsTrigger
              key={category.value}
              value={category.value}
              className="w-full text-left justify-start p-4 rounded-md text-base data-[state=active]:bg-card data-[state=inactive]:hover:bg-primary-foreground/10 data-[state=inactive]:text-primary-foreground/80"
              >
              {category.title}
              </TabsTrigger>
          ))}
          </TabsList>
      </div>

      <div className="col-span-2 bg-card p-8 rounded-l-3xl relative -ml-10 z-10 h-full">
           <div className="pl-6 h-full">
          {faqData.map((category) => (
              <TabsContent key={category.value} value={category.value} className="h-full">
                  <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                  <Accordion type="single" collapsible className="w-full h-[calc(100%-3rem)]">
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
    </motion.div>
  );
}
