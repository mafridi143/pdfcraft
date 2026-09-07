import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { blogArticles } from '@/config/blog-articles';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Blog - PDF Tools & Tips | ZemPDF',
  description: 'Read the latest guides, tips, and articles about managing, editing, and securing your PDF documents.',
};

interface BlogIndexPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale as Locale} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[hsl(var(--color-primary)/0.1)] via-[hsl(var(--color-background))] to-[hsl(var(--color-secondary)/0.1)] py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6">
              PDF Guides & Articles
            </h1>
            <p className="text-lg text-[hsl(var(--color-muted-foreground))] max-w-2xl mx-auto">
              Discover tips, tutorials, and best practices for managing your digital documents securely and efficiently.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogArticles.map((post) => (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                  <Card className="h-full p-6 glass-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg border-[hsl(var(--color-border))/0.6] group-hover:border-[hsl(var(--color-primary)/0.3)]">
                    <div className="text-sm text-[hsl(var(--color-muted-foreground))] mb-3 flex items-center gap-2">
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-3 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 text-[hsl(var(--color-primary))] font-medium flex items-center gap-1">
                      Read more <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
