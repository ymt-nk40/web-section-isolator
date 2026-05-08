'use client';

import { Palette, Code2, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="font-serif italic text-sm mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Customize
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em]">Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div 
          className="rounded-[24px] p-5 animate-card-in"
          style={{ 
            background: 'rgb(22, 22, 22)', 
            border: '1px solid rgba(255,255,255,0.07)' 
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Palette className="h-5 w-5" style={{ color: '#ff3700' }} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold">Appearance</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Customize the look and feel
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Use dark theme (enabled by default)
              </p>
            </div>
            <Switch defaultChecked disabled />
          </div>
        </div>

        {/* Editor */}
        <div 
          className="rounded-[24px] p-5 animate-card-in"
          style={{ 
            background: 'rgb(22, 22, 22)', 
            border: '1px solid rgba(255,255,255,0.07)',
            animationDelay: '0.1s',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Code2 className="h-5 w-5" style={{ color: '#ff3700' }} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold">Editor</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Code editor preferences
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <p className="text-sm font-medium">Auto-format Output</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Automatically format extracted code
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <p className="text-sm font-medium">Line Numbers</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Show line numbers in output
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div 
          className="rounded-[24px] p-5 animate-card-in"
          style={{ 
            background: 'rgb(22, 22, 22)', 
            border: '1px solid rgba(255,255,255,0.07)',
            animationDelay: '0.2s',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Bell className="h-5 w-5" style={{ color: '#ff3700' }} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold">Notifications</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Manage notification preferences
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <p className="text-sm font-medium">Copy Confirmation</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Show notification when copying to clipboard
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Info Note */}
        <div 
          className="rounded-[12px] p-4 animate-card-in"
          style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)',
            animationDelay: '0.3s',
          }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Settings are stored locally in your browser and will persist across sessions.
            This feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
