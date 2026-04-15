import * as React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have a question about our equipment or need a quote for a service? We're here to help.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm">info@nordbase.org</p>
                <p className="text-muted-foreground text-sm">support@nordbase.org</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm">+351 9XX XXX XXX</p>
                <p className="text-muted-foreground text-sm">Mon-Fri, 8am - 6pm</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm">Portimão, Algarve</p>
                <p className="text-muted-foreground text-sm">Portugal</p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Working Hours</h3>
                <p className="text-muted-foreground text-sm">Mon-Fri: 08:00 - 18:00</p>
                <p className="text-muted-foreground text-sm">Sat: 09:00 - 13:00</p>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MessageSquare className="h-24 w-24" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Urgent Request?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                For emergency equipment needs or urgent construction services, please call our hotline directly. We offer 24/7 support for registered professional clients.
              </p>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-xl">
                Call Support Now
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-panel border-white/5 rounded-[3rem] overflow-hidden">
              <CardContent className="p-10">
                <h2 className="text-3xl font-display font-bold mb-8">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" className="glass-panel border-white/10 rounded-xl py-6" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="glass-panel border-white/10 rounded-xl py-6" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Equipment Inquiry" className="glass-panel border-white/10 rounded-xl py-6" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="glass-panel border-white/10 rounded-xl min-h-[150px]" required />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-8 text-xl rounded-2xl font-bold orange-glow group">
                    Send Message
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
