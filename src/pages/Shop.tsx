import * as React from 'react';
import { useState, useEffect } from 'react';
import { Product, Category } from '@/src/types';
import { ProductCard } from '@/src/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/src/store/useUIStore';
import { Search, Filter, Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const SEED_PRODUCTS: Partial<Product>[] = [
  {
    name: { en: 'Ring Saw 300 mm', pt: 'Serra de Anel 300 mm' },
    slug: 'ring-saw-300mm',
    category: 'Ring Saw',
    rentalPrice: 80,
    description: { en: 'Professional ring saw for deep cutting in concrete.', pt: 'Serra de anel profissional para corte profundo em betão.' },
    shortDescription: { en: '300mm professional ring saw.', pt: 'Serra de anel profissional de 300mm.' },
    images: ['https://picsum.photos/seed/ringsaw/800/800'],
    inStock: true,
    status: 'available',
    specifications: [{ key: 'Depth', value: '300mm' }, { key: 'Power', value: '3.2kW' }],
    createdAt: Date.now()
  },
  {
    name: { en: 'Magnetic Drill MD40', pt: 'Berbequim Magnético MD40' },
    slug: 'magnetic-drill-md40',
    category: 'MAGNETIC DRILL',
    rentalPrice: 65,
    description: { en: 'Compact and powerful magnetic drill for steel construction.', pt: 'Berbequim magnético compacto e potente para construção em aço.' },
    shortDescription: { en: 'Professional magnetic drill.', pt: 'Berbequim magnético profissional.' },
    images: ['https://picsum.photos/seed/magdrill/800/800'],
    inStock: true,
    status: 'available',
    specifications: [{ key: 'Capacity', value: '40mm' }, { key: 'Power', value: '1100W' }],
    createdAt: Date.now()
  },
  {
    name: { en: 'Diamond Core Drill 250 mm', pt: 'Caroteadora Diamantada 250 mm' },
    slug: 'core-drill-250mm',
    category: 'Diamond Core Drill',
    rentalPrice: 95,
    description: { en: 'High-performance diamond core drill for precise holes.', pt: 'Caroteadora diamantada de alto desempenho para furos precisos.' },
    shortDescription: { en: '250mm diamond core drill.', pt: 'Caroteadora diamantada de 250mm.' },
    images: ['https://picsum.photos/seed/coredrill/800/800'],
    inStock: true,
    status: 'available',
    specifications: [{ key: 'Diameter', value: '250mm' }, { key: 'Brand', value: 'Eibenstock' }],
    createdAt: Date.now()
  }
];

const CATEGORIES: Category[] = [
  'Nail Gun',
  'MAGNETIC DRILL',
  'DRILL MACHINE',
  'Wire Strip Machine',
  'Ring Saw',
  'Brushless Wall Slot Machine',
  'Brushless Angle Grinder',
  'Diamond Core Drill',
  'Diamond Core Drill Bit',
  'Seam Locker',
  'ANNULAR CUTTER',
  'Cold Metal Saw',
  'Magnetic Chip Collector',
  'Plastic Crusher Machine',
  'Air Compressor',
  'Others'
];

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const { t } = useUIStore();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const productList = await response.json();
      
      if (productList.length === 0) {
        // Initialize DB if empty (optional, could also be done via /api/init-db)
        await fetch('/api/init-db');
        // Seed data if empty
        for (const p of SEED_PRODUCTS) {
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p)
          });
        }
        fetchProducts();
        return;
      }
      
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.en.toLowerCase().includes(search.toLowerCase()) || 
                          p.name.pt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4">
              {t('shop.title')}
            </h1>
            <p className="text-muted-foreground">
              Professional tools for professional results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                className="pl-10 glass-panel border-white/10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={category} onValueChange={(val) => setCategory(val as Category | 'All')}>
              <SelectTrigger className="w-full sm:w-48 glass-panel border-white/10 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-white/10">
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel rounded-[3rem]">
            <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
            <Button 
              variant="link" 
              className="mt-4 text-primary"
              onClick={() => { setSearch(''); setCategory('All'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
