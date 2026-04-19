import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, Language } from '@/src/types';
import { useCartStore } from '@/src/store/useCartStore';
import { useUIStore } from '@/src/store/useUIStore';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useUIStore();
  const { addItem } = useCartStore();

  const name = product.name[language as Language];
  const shortDesc = product.shortDescription[language as Language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-panel overflow-hidden border-white/5 h-full flex flex-col group">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || 'https://picsum.photos/seed/tool/400/400'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-white border-none backdrop-blur-sm">
              {product.category}
            </Badge>
          </div>
          {product.inStock ? (
            <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-sm p-1 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-sm p-1 rounded-full">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>

        <CardContent className="p-6 flex-grow">
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {shortDesc}
          </p>
          <div className="flex items-center">
            <span className="text-sm font-medium text-primary">Inquire for pricing</span>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Link to={`/product/${product.slug}`} className="w-full">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              <Info className="h-4 w-4 mr-2" />
              {t('shop.rent_now')}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
