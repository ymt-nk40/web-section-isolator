'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, AppHeader, type PageType } from '@/components/layout';
import {
  ExtractorPage,
  CSSClassExtractorPage,
  DesignTokensPage,
  AboutPage,
  SettingsPage,
} from '@/components/pages';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('extractor');

  const renderPage = () => {
    switch (currentPage) {
      case 'extractor':
        return <ExtractorPage />;
      case 'class-extractor':
        return <CSSClassExtractorPage />;
      case 'design-tokens':
        return <DesignTokensPage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ExtractorPage />;
    }
  };

  return (
    <SidebarProvider className="h-dvh overflow-hidden bg-background">
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset className="h-dvh min-w-0 overflow-hidden">
        <AppHeader currentPage={currentPage} />
        <main
          className="relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 pt-[72px] md:p-8 md:pt-8"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(255,55,0,0.12), transparent 32rem), radial-gradient(circle at bottom right, rgba(46,204,113,0.08), transparent 30rem), rgb(14, 14, 14)',
          }}
        >
          {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
