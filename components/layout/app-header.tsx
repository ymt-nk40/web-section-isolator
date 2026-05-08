'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import type { PageType } from './app-sidebar';

interface AppHeaderProps {
  currentPage: PageType;
}

const pageTitles: Record<PageType, string> = {
  extractor: 'Extractor',
  'class-extractor': 'CSS Class Extractor',
  'design-tokens': 'Design Tokens',
  about: 'About',
  settings: 'Settings',
};

export function AppHeader({ currentPage }: AppHeaderProps) {
  return (
    <header 
      className="md:hidden fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-5 py-3.5"
      style={{ 
        background: 'rgb(22, 22, 22)', 
        borderBottom: '1px solid rgba(255,255,255,0.07)' 
      }}
    >
      <SidebarTrigger 
        className="w-9 h-9 rounded-lg flex items-center justify-center border"
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderColor: 'rgba(255,255,255,0.07)' 
        }}
      />
      <span className="text-sm font-semibold tracking-[-0.03em]">
        {pageTitles[currentPage]}
      </span>
      <div className="w-9" />
    </header>
  );
}
