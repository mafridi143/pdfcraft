import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Terms of Service | ZemPDF',
  description: 'Terms of Service for ZemPDF tools.',
};

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale as Locale} />
      
      <main className="flex-1 pb-16 pt-24">
        <article className="container mx-auto px-4 max-w-3xl">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-4">
              Terms of Service
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Last updated: September 7, 2026
            </p>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-[hsl(var(--color-muted-foreground))]">
            <p>Welcome to ZemPDF. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">1. Use of the Service</h2>
            <p>ZemPDF provides online PDF tools for managing and editing PDF files. Our service is provided "as is" and "as available". We do not guarantee that the service will be uninterrupted or error-free.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">2. Privacy and Data Security</h2>
            <p>We process all your files locally in your browser. We do not upload, store, or share your documents with any third-party server. For more details, please review our <a href={`/${locale}/privacy`} className="text-[hsl(var(--color-primary))] hover:underline">Privacy Policy</a>.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">3. Prohibited Conduct</h2>
            <p>You agree not to use our service for any illegal or unauthorized purpose. You must not use our service to distribute viruses, malware, or any other malicious code.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">4. Limitation of Liability</h2>
            <p>In no event shall ZemPDF be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.</p>
            
            <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mt-8 mb-4">5. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
          </div>
        </article>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
