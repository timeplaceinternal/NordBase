/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { ProductDetail } from './pages/ProductDetail';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Toaster } from '@/components/ui/sonner';
import { useUIStore } from './store/useUIStore';

export default function App() {
  const { fetchSiteSettings, siteSettings } = useUIStore();

  useEffect(() => {
    fetchSiteSettings();
  }, [fetchSiteSettings]);

  useEffect(() => {
    if (siteSettings.logoUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      link.href = siteSettings.logoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
      
      const appleLink = document.querySelector("link[rel~='apple-touch-icon']") as HTMLLinkElement || document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = siteSettings.logoUrl;
      document.getElementsByTagName('head')[0].appendChild(appleLink);
    }
    if (siteSettings.siteName) {
      document.title = siteSettings.siteName + ' | Nordic Reliability';
    }
  }, [siteSettings]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin162463" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

