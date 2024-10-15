'use client';
import './globals.css';
import { SidebarDemo } from '../components/SidebarDemo';
import AdSense from '@/components/AdSense';
import {Providers} from "./providers";
import "./globals.css";



export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
            <head>
        <AdSense pId="ca-pub-9112160833265609"/>
      </head>
      <body className="flex h-screen"> {/* Flex layout for sidebar and content */}

        <div className="sidebar"> {/* Sidebar wrapper */}
          <SidebarDemo />
        </div>
        <div className="content"> {/* Content wrapper */}
        <Providers>

          {children}
          </Providers>

        </div>
      </body>
    </html>
  );
}
