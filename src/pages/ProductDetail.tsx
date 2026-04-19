import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, Language } from '@/src/types';
import { useUIStore } from '@/src/store/useUIStore';
import { useCartStore } from '@/src/store/useCartStore';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ShieldCheck,
  Truck,
  Wrench,
  Loader2,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useUIStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const name = product.name[language as Language];
  const description = product.description[language as Language];

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 glass-panel">
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 glass-panel cursor-pointer hover:border-primary/50 transition-colors">
                  <img src={img} alt={`${name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary px-3 py-1 bg-primary/5">
                {product.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4">
                {name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-primary uppercase tracking-widest">Inquire for pricing & availability</span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Certified Quality</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Expert Support</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Original Spare Parts</span>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <Link to="/contact" className="w-full block">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white py-8 text-xl rounded-2xl orange-glow"
                >
                  <Mail className="h-6 w-6 mr-3" />
                  {t('product.book')}
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                Our experts will contact you with a customized offer
              </p>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <div className="mt-24">
          <h2 className="text-3xl font-display font-bold mb-8">{t('product.specs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.specifications.map((spec, i) => (
              <div key={i} className="flex justify-between items-center p-6 glass-panel rounded-2xl border-white/5">
                <span className="text-muted-foreground font-medium">{spec.key}</span>
                <span className="font-bold text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
