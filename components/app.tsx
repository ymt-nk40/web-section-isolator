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
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader currentPage={currentPage} />
        <main 
          className="flex-1 overflow-auto md:p-8 p-4 pt-[72px] md:pt-8"
          style={{ background: 'rgb(14, 14, 14)' }}
        >
          {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
