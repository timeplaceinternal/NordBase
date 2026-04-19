import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/src/store/useUIStore';
import { useCartStore } from '@/src/store/useCartStore';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, siteSettings } = useUIStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {siteSettings.logoUrl ? (
                <img src={siteSettings.logoUrl} alt={siteSettings.siteName || 'Logo'} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center orange-glow">
                  <span className="text-white font-display font-bold text-xl">N</span>
                </div>
              )}
              <span className="text-2xl font-display font-bold tracking-tighter uppercase">
                {siteSettings.siteName ? (
                   siteSettings.siteName
                ) : (
                  <>NORD <span className="text-primary">BASE</span></>
                )}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 border-l border-white/10 pl-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="hover:bg-white/5"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle Language</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/70 hover:text-primary"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-foreground/70 hover:text-primary hover:bg-white/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between px-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                  className="border-white/10"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Português' : 'English'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
