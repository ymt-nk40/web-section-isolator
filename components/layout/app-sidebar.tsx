'use client';

import {
  Layers,
  Code,
  Palette,
  Info,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export type PageType = 'extractor' | 'class-extractor' | 'design-tokens' | 'about' | 'settings';

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const toolsNavItems: NavItem[] = [
  { id: 'extractor', label: 'Extractor', icon: Layers, description: 'HTML + CSS isolation' },
  { id: 'class-extractor', label: 'CSS Class Extractor', icon: Code, description: 'Rule filtering' },
  { id: 'design-tokens', label: 'Design Tokens', icon: Palette, badge: 'NEW', description: 'Color and style audit' },
];

const settingsNavItems: NavItem[] = [
  { id: 'about', label: 'About', icon: Info, description: 'Product details' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Workspace options' },
];

interface AppSidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,16,0.96)]">
      <SidebarHeader className="px-5 pb-5 pt-6">
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[16px] shadow-[0_8px_26px_rgba(255,55,0,0.42)]"
              style={{ background: 'linear-gradient(135deg, #ff3700, #ff6a00)' }}
            >
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-[15px] font-semibold tracking-[-0.03em]">Web Isolator</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Extraction Studio
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-[rgba(46,204,113,0.18)] bg-[rgba(46,204,113,0.08)] px-3 py-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: '#2ECC71' }} />
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.68)' }}>
              Browser-only processing
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 pb-4">
        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.1em] font-mono px-2.5 mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`
                      group/nav relative mb-1.5 h-auto items-start gap-3 rounded-[16px] border px-3 py-3 text-left
                      transition-all duration-200
                      ${currentPage === item.id
                        ? 'border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.09)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'border-transparent text-[rgba(255,255,255,0.54)] hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                      }
                    `}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] transition-all ${
                        currentPage === item.id ? 'bg-[#ff3700] text-white' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.55)]'
                      }`}
                    >
                      <item.icon className="h-[15px] w-[15px]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-semibold">{item.label}</span>
                        {item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </span>
                      <span className="truncate text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.32)' }}>
                        {item.description}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mb-2">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.1em] font-mono px-2.5 mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`
                      group/nav mb-1 h-auto gap-3 rounded-[14px] border px-3 py-2.5 text-left
                      transition-all duration-200
                      ${currentPage === item.id
                        ? 'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] text-white'
                        : 'border-transparent text-[rgba(255,255,255,0.52)] hover:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                      }
                    `}
                  >
                    <item.icon className={`mt-0.5 h-[15px] w-[15px] flex-shrink-0 ${currentPage === item.id ? 'opacity-100' : 'opacity-70'}`} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-[13px] font-medium">{item.label}</span>
                      <span className="truncate text-[11px] font-normal" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        {item.description}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-[rgba(255,255,255,0.07)] px-5 py-5">
        <div className="mb-4 rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: '#ff3700' }} />
            <span className="text-[12px] font-semibold">Ready to extract</span>
          </div>
          <p className="mt-1 text-[11px] leading-4" style={{ color: 'rgba(255,255,255,0.34)' }}>
            Upload files, isolate a section, then copy clean standalone code.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div 
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] flex-shrink-0"
            style={{ background: 'rgb(28, 28, 28)' }}
          >
            <span className="font-serif italic text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>U</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold">User</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="status-dot" />
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Available</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
