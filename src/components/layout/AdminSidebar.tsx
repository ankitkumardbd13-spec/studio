
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Layout, 
  Wand2, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  FileText,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function AdminSidebar() {
  const pathname = usePathname();
  const [siteLogo, setSiteLogo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_site_settings');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.logo) setSiteLogo(data.logo);
    }
  }, []);

  const defaultLogo = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const logoUrl = siteLogo || defaultLogo;

  const menuItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: Layout },
    { name: 'Assignments', href: '/admin/assignments', icon: FileText },
    { name: 'Fee Management', href: '/admin/fees', icon: CreditCard },
    { name: 'AI Question Gen', href: '/admin/tools', icon: Wand2 },
    { name: 'Drafting Assistant', href: '/admin/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white min-h-screen sticky top-0">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-1 flex items-center justify-center">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          )}
        </div>
        <div>
          <h2 className="font-headline text-xl font-bold text-primary leading-tight">MPITI Admin</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Management Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary text-white font-bold shadow-lg shadow-primary/20" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/5 hover:text-red-400" asChild>
          <Link href="/login"><LogOut className="w-4 h-4" /> Log Out</Link>
        </Button>
      </div>
    </aside>
  );
}
