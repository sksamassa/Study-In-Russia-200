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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';

export const metadata = {
  title: 'Blog - Global Pathways Hub',
  description: 'Articles and news about studying in Russia for international students.',
};

export default function BlogPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Our Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stay informed with the latest news, tips, and stories about student
          life in the Russian Federation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col justify-between h-full">
            <CardHeader className="p-0 w-full">
              <Link href={`/blog/${post.slug}`}>
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
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-3 text-center">{post.description}</CardDescription>
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
