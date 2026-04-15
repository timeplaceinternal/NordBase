import { motion } from 'motion/react';
import { Shield, Target, Users, Award, CheckCircle2 } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Nordic Standards',
      description: 'We adhere to the highest Scandinavian standards of safety, quality, and environmental responsibility.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Precision Focused',
      description: 'In construction, millimeters matter. Our equipment and services are designed for absolute precision.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Local Expertise',
      description: 'We understand the unique challenges of the Algarve construction market and provide tailored solutions.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Premium Only',
      description: 'We only work with world-class brands like Bosch, Trotec, Yongkang Master, and Eibenstock.'
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-8">
              Our <span className="text-primary">Mission</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Nord Base was founded with a simple goal: to bring the reliability and efficiency of Nordic construction standards to the beautiful Algarve region.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We believe that professional equipment shouldn't just be a tool, but a partner in your success. Whether you're a large-scale contractor or a dedicated homeowner, we provide the same level of premium service and high-performance machinery.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-medium">Founded in Algarve, inspired by the North</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-medium">Committed to sustainable construction practices</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-medium">Building long-term partnerships with our clients</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden border border-white/5 glass-panel aspect-square">
              <img
                src="https://picsum.photos/seed/team/800/800"
                alt="Our Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 glass-panel p-8 rounded-3xl border-white/10 hidden md:block">
              <p className="text-4xl font-display font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground">Years of Experience</p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from equipment selection to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 rounded-3xl border-white/5 hover:border-primary/30 transition-colors"
              >
                <div className="mb-6 p-3 bg-primary/5 rounded-2xl w-fit">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-secondary/30 rounded-[3rem] p-12 md:p-20 border border-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl md:text-6xl font-display font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Clients</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-display font-bold text-primary mb-2">150+</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Tools</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-display font-bold text-primary mb-2">1.2k</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Bookings</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-display font-bold text-primary mb-2">100%</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Reliability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
