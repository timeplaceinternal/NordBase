import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Clock, Wrench, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUIStore } from '@/src/store/useUIStore';
import { Badge } from '@/components/ui/badge';

export function Home() {
  const { t } = useUIStore();

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Nordic Reliability',
      description: 'We bring Scandinavian standards of quality and reliability to the Algarve construction market.'
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: '24/7 Support',
      description: 'Our team is always ready to assist you with equipment setup or urgent service requests.'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'High Efficiency',
      description: 'Modern, well-maintained equipment that ensures your project stays on schedule.'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden nordic-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1 rounded-full bg-primary/5">
                Premium Equipment Rental
              </Badge>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 tracking-tighter">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                {t('hero.subtitle')} From diamond cutting to industrial dehumidifiers, we provide the tools you need to succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl orange-glow group">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 px-8 py-6 text-lg rounded-xl">
                    Our Services
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://picsum.photos/seed/construction/800/600"
                  alt="Construction Equipment"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-panel p-4 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Trusted by 500+ Professionals</p>
                      <p className="text-xs text-muted-foreground">Certified equipment & expert service</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Why Choose Nord Base?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine Nordic precision with local Algarve expertise to deliver unmatched value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-panel p-8 rounded-3xl hover:border-primary/30 transition-colors group"
              >
                <div className="mb-6 p-3 bg-primary/5 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Turnkey Services</h2>
              <p className="text-muted-foreground">
                Beyond rentals, we offer specialized construction services performed by our expert team.
              </p>
            </div>
            <Link to="/services">
              <Button variant="link" className="text-primary p-0 h-auto text-lg font-bold group">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-3xl aspect-[16/9]">
              <img
                src="https://picsum.photos/seed/sawing/800/450"
                alt="Diamond Sawing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold text-white mb-2">Diamond Sawing & Drilling</h3>
                <p className="text-white/70 text-sm max-w-xs">Precision cutting for concrete and stone structures.</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl aspect-[16/9]">
              <img
                src="https://picsum.photos/seed/hvac/800/450"
                alt="Ventilation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-bold text-white mb-2">Ventilation Systems</h3>
                <p className="text-white/70 text-sm max-w-xs">Installation of advanced recuperators and HVAC solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden orange-glow">
            <div className="absolute top-0 left-0 w-full h-full nordic-grid opacity-20" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tighter">
                Ready to Start Your Project?
              </h2>
              <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
                Join hundreds of satisfied customers in Algarve who trust Nord Base for their equipment and service needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/shop">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-10 py-7 text-xl rounded-2xl font-bold">
                    Browse Equipment
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-7 text-xl rounded-2xl font-bold">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
