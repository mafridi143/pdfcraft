import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Cookie Policy | ZemPDF',
  description: 'Cookie Policy for ZemPDF tools.',
};

interface CookiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale as Locale} />
      
      <main className="flex-1 pb-16 pt-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-4">
              Cookie Policy
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Last updated: September 7, 2026
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-[hsl(var(--color-muted-foreground))]">
            <p>This Cookie Policy explains how ZemPDF uses cookies and similar technologies to recognize you when you visit our website.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">1. What are cookies?</h2>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">2. How we use cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website. For example, remembering your theme preference (dark/light mode).</li>
              <li><strong>Advertising Cookies (Google AdSense):</strong> These cookies are used by third-party vendors, including Google, to serve ads based on your prior visits to our website or other websites.</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">3. Managing your preferences</h2>
            <p>When you first visit our site, you are presented with a cookie banner that allows you to accept or decline non-essential cookies. You can also modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.</p>
            <p>To opt out of personalized advertising by Google, you can visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--color-primary))] hover:underline">Google Ads Settings</a>.</p>
          </div>
        </article>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
