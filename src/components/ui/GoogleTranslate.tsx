"use client";

import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };
  }, []);

  return (
    <div className="flex items-center">
      <div id="google_translate_element" className="google-translate-container" />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid hsl(var(--border)) !important;
          padding: 4px 8px !important;
          border-radius: 9999px !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          font-family: inherit !important;
        }
        .goog-te-menu-value {
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .goog-te-menu-value span {
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }
        .goog-te-menu-value img {
          display: none !important;
        }
        .goog-te-menu-value:after {
          content: '▼';
          font-size: 10px;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
