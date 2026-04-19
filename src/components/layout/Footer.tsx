import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-display font-bold tracking-tighter">
                NORD <span className="text-primary">BASE</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Nordic Reliability in Algarve. Premium equipment and specialized construction services for professionals and demanding DIYers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6 text-foreground/90">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary text-sm transition-colors">Equipment Shop</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Specialized Services</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">Our Mission</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6 text-foreground/90">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">Portimão, Algarve, Portugal</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">+351 9XX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">info@nordbase.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-6 text-foreground/90">Business Info</h4>
            <p className="text-muted-foreground text-sm mb-4">
              CAE: 77320, 43990, 43222
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Nord Base is committed to providing the highest quality tools and services in the Algarve region, following Nordic standards of reliability and efficiency.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-xs mb-4 md:mb-0">
            © {new Date().getFullYear()} Nord Base. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
