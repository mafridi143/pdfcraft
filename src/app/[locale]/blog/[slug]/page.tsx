import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { blogArticles } from '@/config/blog-articles';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { marked } from 'marked';
import { sanitizeHtml } from '@/lib/utils/html-sanitizer';

interface BlogArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const article of blogArticles) {
      params.push({ locale, slug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find(a => a.slug === slug);
  
  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | ZemPDF Blog`,
    description: article.excerpt,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Parse markdown content safely
  const rawHtml = await marked.parse(article.content);
  const cleanHtml = sanitizeHtml(rawHtml);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale as Locale} />
      
      <main className="flex-1 pb-16 pt-24">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Back Navigation */}
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to all articles
          </Link>

          {/* Article Header */}
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-[hsl(var(--color-muted-foreground))]">
              <span className="font-medium">{article.author}</span>
              <span>•</span>
              <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[hsl(var(--color-primary))] hover:prose-a:text-[hsl(var(--color-primary)/0.8)]"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </article>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
