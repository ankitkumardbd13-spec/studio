"use client";

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdSenseInterstitial() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-500">
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/50 ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Advertisement</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsVisible(false)}
            className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Ad Container */}
        <div className="p-6 h-[400px] flex flex-col items-center justify-center text-center">
          {/* AdSense Unit */}
          <div className="w-full h-full bg-muted/40 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border/60">
             <div className="p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-1">Google AdSense</p>
                <p className="text-[10px] text-muted-foreground">Publisher: pub-4054187337667749</p>
             </div>
             
             <div className="w-full flex justify-center">
                <ins className="adsbygoogle"
                     style={{ display: 'block', width: '100%', height: '280px' }}
                     data-ad-client="ca-pub-4054187337667749"
                     data-ad-slot="INTERSTITIAL_AD_SLOT"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
             </div>
             
             <script dangerouslySetInnerHTML={{ __html: '(window.adsbygoogle = window.adsbygoogle || []).push({});' }} />
             
             <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                <span>View Sponsors</span>
                <ExternalLink className="w-3 h-3" />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 flex items-center justify-between bg-muted/20 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground font-medium">Wait 10 seconds to see more...</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsVisible(false)} className="rounded-full px-6 text-xs h-9">
              Skip
            </Button>
            <Button size="sm" onClick={() => setIsVisible(false)} className="rounded-full px-6 text-xs h-9 shadow-lg shadow-primary/20">
              Close Ad
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
