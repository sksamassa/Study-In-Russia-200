import { blogPosts, type Post } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Locale } from '@/i18n/i18n-config';
import { getDictionary } from '@/i18n/get-dictionary';

type BlogPostPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateStaticParams() {
    // This should ideally be dynamic based on languages, but for now we can do this
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - Study In Russia 200`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const dictionary = await getDictionary(params.lang);
  const post = dictionary.blog.posts[params.slug as keyof typeof dictionary.blog.posts];
  const staticPostData = blogPosts.find((p) => p.slug === params.slug);


  if (!post || !staticPostData) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <article className="container max-w-4xl py-12 md:py-20">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
          <div className="flex justify-center items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{staticPostData.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{staticPostData.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{staticPostData.date}</span>
            </div>
          </div>
        </div>

        <div className="my-8">
          <Image
            src={staticPostData.image.imageUrl}
            alt={post.title}
            width={1200}
            height={700}
            className="rounded-lg object-cover aspect-video"
            priority
            data-ai-hint={staticPostData.image.imageHint}
          />
        </div>

        <div
          className="prose dark:prose-invert max-w-none mx-auto text-foreground/90
                   prose-headings:font-headline prose-headings:text-foreground
                   prose-p:font-body
                   prose-a:text-primary prose-a:transition-colors hover:prose-a:text-primary/80
                   prose-strong:text-foreground
                   prose-ul:list-disc prose-ol:list-decimal
                   prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
