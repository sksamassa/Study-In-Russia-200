import { blogPosts } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Locale } from '@/i18n/i18n-config';
import { getDictionary } from '@/i18n/get-dictionary';


export const metadata = {
  title: 'Blog - Study In Russia 200',
  description: 'Articles and news about studying in Russia for international students.',
};

export default async function BlogPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    const posts = Object.values(dictionary.blog.posts);
  return (
    <div className="container px-10 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">{dictionary.blog.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {dictionary.blog.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col justify-between h-full">
            <CardHeader className="p-0 w-full">
              <Link href={`/${lang}/blog/${post.slug}`}>
                <Image
                  src={post.image.imageUrl}
                  alt={post.title}
                  width={800}
                  height={600}
                  className="rounded-t-lg object-cover aspect-[4/3]"
                  data-ai-hint={post.image.imageHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="flex-grow p-6 flex flex-col justify-center">
              <CardTitle className="text-xl leading-snug text-center">
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {dictionary.blog.posts[post.slug as keyof typeof dictionary.blog.posts].title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-3 text-center">{dictionary.blog.posts[post.slug as keyof typeof dictionary.blog.posts].description}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{post.date}</span>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
