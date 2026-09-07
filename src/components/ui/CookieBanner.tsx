'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented or declined
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-background/95 backdrop-blur-md border-t shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--color-primary)/0.1)] items-center justify-center">
            <Cookie className="w-5 h-5 text-[hsl(var(--color-primary))]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--color-foreground))] mb-1">
              We value your privacy
            </h3>
            <p className="text-xs text-[hsl(var(--color-muted-foreground))] leading-relaxed max-w-3xl">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies, including third-party cookies from Google AdSense. 
              You can learn more in our <a href="/en/privacy" className="text-[hsl(var(--color-primary))] hover:underline font-medium">Privacy Policy</a>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium border border-[hsl(var(--color-border))] rounded-md hover:bg-[hsl(var(--color-muted))] text-[hsl(var(--color-foreground))] transition-colors whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium bg-[hsl(var(--color-primary))] text-white rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            Accept All
          </button>
          <button 
            onClick={handleDecline}
            className="p-2 text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors hidden sm:block"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
