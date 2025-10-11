import { PlaceHolderImages } from './placeholder-images';

export type Post = {
  slug: string;
  title: string;
  description: string;
  image: (typeof PlaceHolderImages)[0];
  author: string;
  date: string;
  content: string;
};

export const blogPosts: Post[] = [
  {
    slug: 'navigating-the-russian-student-visa-process',
    title: 'Navigating the Russian Student Visa Process: A Step-by-Step Guide',
    description:
      'Understanding the Russian student visa process can be daunting. Our guide breaks it down into manageable steps, ensuring you have all the necessary documentation and information for a smooth application.',
    image: PlaceHolderImages.find((img) => img.id === 'blog-1')!,
    author: 'Admin',
    date: 'August 15, 2024',
    content: `<p>The journey to studying in Russia begins with a successful visa application. This comprehensive guide will walk you through each stage, from receiving your university invitation to submitting your application at the Russian consulate. We'll cover common pitfalls and provide tips to ensure your application is as strong as possible.</p>
    <h2>Key Documents Required:</h2>
    <ul>
      <li>Original university invitation letter.</li>
      <li>Valid international passport.</li>
      <li>Completed visa application form.</li>
      <li>HIV test (negative) certificate.</li>
      <li>Educational certificates.</li>
    </ul>
    <p>We recommend starting this process at least 3 months before your intended travel date to account for any potential delays.</p>`,
  },
  {
    slug: 'top-5-reasons-to-study-in-russia',
    title: 'Top 5 Reasons to Choose Russia for Your Higher Education',
    description:
      'From world-renowned universities to rich cultural experiences, discover the top reasons why Russia is an excellent destination for international students.',
    image: PlaceHolderImages.find((img) => img.id === 'blog-2')!,
    author: 'Admin',
    date: 'July 28, 2024',
    content: `<p>Russia has a long-standing tradition of high-quality education, especially in the fields of science, technology, engineering, and mathematics (STEM). Here are five compelling reasons to consider Russia for your academic journey:</p>
    <ol>
      <li><strong>Globally Recognized Universities:</strong> Many Russian universities are ranked among the best in the world.</li>
      <li><strong>Affordable Tuition Fees:</strong> Compared to Western countries, the cost of education and living in Russia is significantly lower.</li>
      <li><strong>Rich Cultural Heritage:</strong> Immerse yourself in a country with a deep history, stunning architecture, and vibrant arts scene.</li>
      <li><strong>Diverse Range of Programs:</strong> Choose from hundreds of programs taught in both Russian and English.</li>
      <li><strong>Unique International Experience:</strong> Live and study in a transcontinental country, offering a unique blend of European and Asian cultures.</li>
    </ol>`,
  },
  {
    slug: 'life-as-an-international-student-in-moscow',
    title: 'Life as an International Student in Moscow',
    description:
      'What is it really like to live and study in Russia’s bustling capital? We share insights on accommodation, transportation, and making the most of your time in Moscow.',
    image: PlaceHolderImages.find((img) => img.id === 'blog-3')!,
    author: 'Admin',
    date: 'July 10, 2024',
    content: `<p>Moscow is a vibrant, 24/7 city that offers endless opportunities for exploration and fun. As a student, you'll find a welcoming community and a wide range of activities to enjoy outside the classroom.</p>
    <h2>Getting Around:</h2>
    <p>The Moscow Metro is one of the most efficient and beautiful subway systems in the world. A student travel card offers discounted fares, making it the most convenient way to navigate the city.</p>
    <h2>Accommodation:</h2>
    <p>Most universities offer student dormitories, which are an affordable and great way to meet other students. Alternatively, you can rent an apartment, though this is a more expensive option.</p>
    <p>From world-class museums like the The State Tretyakov Gallery to sprawling parks like Gorky Park, you'll never run out of things to do in Moscow.</p>`,
  },
  {
    slug: 'preparing-your-documents-for-russian-university-admission',
    title: 'Preparing Your Documents for Russian University Admission',
    description:
      'A complete checklist of the documents you will need to prepare for your application to a Russian university, including tips on translation and legalization.',
    image: PlaceHolderImages.find((img) => img.id === 'blog-4')!,
    author: 'Admin',
    date: 'June 25, 2024',
    content: `<p>Proper document preparation is critical for a successful university application. Our AI-powered verification tool can help, but it's essential to start with the correct documents, properly formatted and legalized. Here's what you'll typically need:</p>
    <ul>
      <li><strong>High School Diploma/Certificate:</strong> Legalized and translated into Russian.</li>
      <li><strong>Academic Transcripts:</strong> Showing all subjects and grades.</li>
      <li><strong>Medical Certificates:</strong> Including a general fitness certificate and a negative HIV test result.</li>
      <li><strong>Copy of your Passport:</strong> Must be valid for at least 18 months from your intended entry date.</li>
      <li><strong>Application Form:</strong> Completed and signed.</li>
    </ul>
    <p>Legalization requirements vary by country. It's crucial to check the specific process (e.g., Apostille or consular legalization) required for your documents.</p>`,
  },
];
