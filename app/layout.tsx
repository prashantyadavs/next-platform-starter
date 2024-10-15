'use client';
import './globals.css';
import { SidebarDemo } from '../components/SidebarDemo';
import { ReactNode } from 'react'; // Import ReactNode for typing
import AdSense from '@/components/AdSense';

interface RootLayoutProps {
  children: ReactNode; // Define the type for the children prop
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen"> {/* Flex layout for sidebar and content */}
      <head>
        <AdSense pId="ca-pub-9112160833265609"/>
      </head>
        <div className="sidebar"> {/* Sidebar wrapper */}
          <SidebarDemo />
        </div>
        <div className="content"> {/* Content wrapper */}
          {children}

        </div>
      </body>
    </html>
  );
}
