import { useCartStore } from '@/src/store/useCartStore';
import { useUIStore } from '@/src/store/useUIStore';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Language } from '@/src/types';

export function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { language, t } = useUIStore();

  const handleCheckout = () => {
    toast.info("Checkout is not implemented in this demo.");
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center nordic-grid">
        <div className="glass-panel p-12 rounded-[3rem] text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any equipment to your booking yet.
          </p>
          <Link to="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-bold orange-glow">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-12">
          Your Booking Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Card className="glass-panel border-white/5 overflow-hidden rounded-3xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.name[language as Language]}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{item.name[language as Language]}</h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-1">
                            {item.shortDescription[language as Language]}
                          </p>
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center space-x-4 glass-panel px-3 py-1 rounded-xl border-white/10">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-bold w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-xl font-bold text-primary">
                              €{item.rentalPrice * item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-destructive"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="glass-panel border-white/5 rounded-[2.5rem] sticky top-32">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-6">Booking Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>€{total()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery (Algarve)</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Insurance</span>
                    <span>€0.00</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">€{total()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-2xl border-white/10 flex items-center space-x-3 mb-6">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">Select rental dates at next step</span>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-8 text-xl rounded-2xl font-bold orange-glow group"
                    onClick={handleCheckout}
                  >
                    Proceed to Booking
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Link to="/shop" className="block text-center">
                    <Button variant="link" className="text-muted-foreground hover:text-primary">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
