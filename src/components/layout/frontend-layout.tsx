'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Mic2, 
  Settings, 
  User, 
  Menu, 
  X, 
  Bell 
} from 'lucide-react';
import { proximaNova, inter } from '@/lib/fonts';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

interface FrontendLayoutProps {
  children: ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={`${proximaNova.variable} ${inter.variable} flex min-h-screen bg-gray-50`}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col md:pl-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-200 z-20">
        <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
            <span className="text-xl font-bold text-blue-600">ContentMetric</span>
          </div>
          <nav className="mt-5 flex-1 px-4 space-y-1 overflow-y-auto">
            <NavLinks />
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link href="/profile" className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs font-medium text-gray-500">View profile</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
                <span className="text-xl font-bold text-blue-600">ContentMetric</span>
              </div>
              <nav className="mt-5 px-4 space-y-1">
                <NavLinks />
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link href="/profile" className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                    <p className="text-xs font-medium text-gray-500">View profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
    </>
  );
}

function NavLinks() {
  const pathname = usePathname() || '';
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/docs', label: 'Documents', icon: FileText },
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/chats', label: 'Chat', icon: MessageSquare },
    { href: '/brand-voice', label: 'Brand Voice', icon: Mic2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon
              className={`mr-3 h-5 w-5 ${
                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
              }`}
            />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center h-16 px-4 sm:px-6">
      <button
        type="button"
        className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 flex justify-between items-center">
        <div className="flex-1 md:ml-8">
          <div className="max-w-lg w-full">
            {/* Search bar could go here */}
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none mr-3"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
            
            {profileMenuOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                onClick={() => setProfileMenuOpen(false)}
              >
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-medium truncate">{user?.email}</p>
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <Link href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 