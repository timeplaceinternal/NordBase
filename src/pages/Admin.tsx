import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Sparkles, 
  Plus, 
  Save, 
  Loader2, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseProductInfo } from '@/src/services/geminiService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { toast } from 'sonner';
import { Product, Category } from '@/src/types';

export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isParsing, setIsParsing] = useState(false);
  const [parseInput, setParseInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: { en: '', pt: '' },
    slug: '',
    category: 'Other',
    rentalPrice: 0,
    description: { en: '', pt: '' },
    shortDescription: { en: '', pt: '' },
    specifications: [],
    images: ['https://picsum.photos/seed/tool/800/800'],
    inStock: true,
    status: 'available'
  });

  const handleParse = async () => {
    if (!parseInput.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseProductInfo(parseInput);
      setFormData({
        ...formData,
        ...result,
        slug: result.name.en.toLowerCase().replace(/\s+/g, '-'),
        createdAt: Date.now()
      });
      toast.success('Product info parsed successfully!');
    } catch (error) {
      toast.error('Failed to parse product info. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        createdAt: Date.now()
      });
      toast.success('Product added to catalog!');
      setFormData({
        name: { en: '', pt: '' },
        slug: '',
        category: 'Other',
        rentalPrice: 0,
        description: { en: '', pt: '' },
        shortDescription: { en: '', pt: '' },
        specifications: [],
        images: ['https://picsum.photos/seed/tool/800/800'],
        inStock: true,
        status: 'available'
      });
      setParseInput('');
    } catch (error) {
      toast.error('Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
              className="w-full justify-start rounded-xl"
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'products' ? 'secondary' : 'ghost'}
              className="w-full justify-start rounded-xl"
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === 'parser' ? 'secondary' : 'ghost'}
              className="w-full justify-start rounded-xl"
              onClick={() => setActiveTab('parser')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Parser
            </Button>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                    <CardDescription className="text-3xl font-bold text-foreground">24</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
                    <CardDescription className="text-3xl font-bold text-foreground">12</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Revenue (MTD)</CardTitle>
                    <CardDescription className="text-3xl font-bold text-primary">€4,250</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}

            {activeTab === 'parser' && (
              <div className="space-y-8">
                <Card className="glass-panel border-white/5 overflow-hidden">
                  <div className="bg-primary/10 p-6 border-b border-white/5 flex items-center space-x-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Gemini AI Product Parser</h3>
                      <p className="text-xs text-muted-foreground">Paste a description or URL to automatically fill product details.</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Label>Product Description or URL</Label>
                      <Textarea
                        placeholder="e.g. Yongkang Master Ring Saw 300mm, 80 EUR/day, professional concrete cutting tool..."
                        className="min-h-[150px] glass-panel border-white/10 rounded-xl"
                        value={parseInput}
                        onChange={(e) => setParseInput(e.target.value)}
                      />
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                        onClick={handleParse}
                        disabled={isParsing || !parseInput.trim()}
                      >
                        {isParsing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Parsing with Gemini...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Parse with Gemini
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/5">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Review and edit the parsed information before saving.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Name (English)</Label>
                        <Input 
                          value={formData.name?.en} 
                          onChange={(e) => setFormData({...formData, name: {...formData.name!, en: e.target.value}})}
                          className="glass-panel border-white/10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Name (Portuguese)</Label>
                        <Input 
                          value={formData.name?.pt} 
                          onChange={(e) => setFormData({...formData, name: {...formData.name!, pt: e.target.value}})}
                          className="glass-panel border-white/10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input 
                          value={formData.category} 
                          onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                          className="glass-panel border-white/10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rental Price (€/day)</Label>
                        <Input 
                          type="number"
                          value={formData.rentalPrice} 
                          onChange={(e) => setFormData({...formData, rentalPrice: Number(e.target.value)})}
                          className="glass-panel border-white/10 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description (English)</Label>
                      <Textarea 
                        value={formData.description?.en} 
                        onChange={(e) => setFormData({...formData, description: {...formData.description!, en: e.target.value}})}
                        className="glass-panel border-white/10 rounded-xl min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button variant="ghost" className="rounded-xl">Discard</Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 rounded-xl px-8"
                        onClick={handleSave}
                        disabled={isSaving || !formData.name?.en}
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="text-center py-24 glass-panel rounded-[3rem]">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Product Management</h3>
                <p className="text-muted-foreground mb-6">View and manage your existing equipment catalog.</p>
                <Button className="bg-primary hover:bg-primary/90 rounded-xl" onClick={() => setActiveTab('parser')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
