'use client';

import {
  Layers,
  Code,
  Palette,
  Info,
  Settings,
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
}

const toolsNavItems: NavItem[] = [
  { id: 'extractor', label: 'Extractor', icon: Layers },
  { id: 'class-extractor', label: 'CSS Class Extractor', icon: Code },
  { id: 'design-tokens', label: 'Design Tokens', icon: Palette, badge: 'NEW' },
];

const settingsNavItems: NavItem[] = [
  { id: 'about', label: 'About', icon: Info },
  { id: 'settings', label: 'Settings', icon: Settings },
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
    <Sidebar className="border-r border-[rgba(255,255,255,0.07)]">
      <SidebarHeader className="px-5 py-7">
        <div className="flex items-center gap-2.5">
          <div 
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] shadow-[0_4px_12px_rgba(255,55,0,0.4)]"
            style={{ background: '#ff3700' }}
          >
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[-0.03em]">Web Isolator</span>
            <span className="text-[11px] uppercase tracking-[0.04em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Tools
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5">
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
                      flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium mb-0.5
                      transition-all duration-200
                      ${currentPage === item.id 
                        ? 'bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-white' 
                        : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white border border-transparent'
                      }
                    `}
                  >
                    <item.icon className={`h-[15px] w-[15px] flex-shrink-0 ${currentPage === item.id ? 'opacity-100' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
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
                      flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium mb-0.5
                      transition-all duration-200
                      ${currentPage === item.id 
                        ? 'bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-white' 
                        : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white border border-transparent'
                      }
                    `}
                  >
                    <item.icon className={`h-[15px] w-[15px] flex-shrink-0 ${currentPage === item.id ? 'opacity-100' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-5 py-5 border-t border-[rgba(255,255,255,0.07)]">
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
