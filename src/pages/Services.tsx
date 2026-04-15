import { motion } from 'motion/react';
import { 
  Zap, 
  Scan, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Clock,
  HardHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export function Services() {
  const services = [
    {
      title: 'Diamond Sawing & Drilling',
      description: 'Precision cutting and core drilling for concrete, stone, and asphalt. We use high-end Yongkang Master and Eibenstock equipment.',
      icon: <Zap className="h-8 w-8 text-primary" />,
      image: 'https://picsum.photos/seed/saw/800/600',
      features: ['Up to 300mm depth', 'Dust-free technology', 'Reinforced concrete specialists']
    },
    {
      title: 'Bosch Structural Scanning',
      description: 'Non-destructive scanning to locate rebar, pipes, and cables before drilling or sawing. Safety first.',
      icon: <Scan className="h-8 w-8 text-primary" />,
      image: 'https://picsum.photos/seed/scan/800/600',
      features: ['High-precision detection', 'Depth measurement', 'Detailed reports']
    },
    {
      title: 'Ventilation & Recuperators',
      description: 'Installation of advanced heat recovery ventilation systems (HRV) for healthy indoor air and energy efficiency.',
      icon: <Wrench className="h-8 w-8 text-primary" />,
      image: 'https://picsum.photos/seed/vent/800/600',
      features: ['Nordic standards', 'Energy saving', 'Professional installation']
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-6">
              Turnkey <span className="text-primary">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We don't just rent equipment; we provide expert solutions for your most challenging construction tasks in Algarve.
            </p>
          </motion.div>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-[3rem] overflow-hidden border border-white/5 glass-panel aspect-video">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <div className="p-4 bg-primary/5 rounded-2xl w-fit">
                  {service.icon}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                  {service.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link to="/contact">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 group">
                      Request Quote
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-32 glass-panel rounded-[3rem] p-12 border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-bold">Fully Insured</h3>
              <p className="text-sm text-muted-foreground">All our services are covered by comprehensive liability insurance.</p>
            </div>
            <div className="space-y-4">
              <Clock className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-bold">On-Time Delivery</h3>
              <p className="text-sm text-muted-foreground">We value your time. We arrive on schedule and work efficiently.</p>
            </div>
            <div className="space-y-4">
              <HardHat className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-bold">Safety Certified</h3>
              <p className="text-sm text-muted-foreground">Our technicians are trained and follow strict safety protocols.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
