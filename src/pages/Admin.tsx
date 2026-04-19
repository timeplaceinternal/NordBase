import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  Sparkles, 
  Plus, 
  Save, 
  Loader2, 
  Trash2,
  Settings,
  FileText,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseProductInfo } from '@/src/services/geminiService';
import { AssetUploader } from '@/src/components/admin/AssetUploader';
import { toast } from 'sonner';
import { Product, Category } from '@/src/types';

interface DB_Category {
  id: number;
  slug: string;
  name_en: string;
  name_pt: string;
  type: 'product' | 'service';
  parent_id: number | null;
}

export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DB_Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parseInput, setParseInput] = useState('');
  
  // CMS State
  const [activePage, setActivePage] = useState('home');
  const [pageContent, setPageContent] = useState<any>({});

  const [formData, setFormData] = useState<Partial<Product>>({
    name: { en: '', pt: '' },
    slug: '',
    category: '',
    subCategory: '',
    rentalPrice: 0,
    description: { en: '', pt: '' },
    shortDescription: { en: '', pt: '' },
    specifications: [],
    images: [],
    inStock: true,
    status: 'available'
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      setProducts(await prodRes.json());
      setCategories(await catRes.json());
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const res = await fetch(`/api/content/${activePage}`);
        const data = await res.json();
        setPageContent(data.content || {});
      } catch (e) {
        toast.error('Failed to load page content');
      }
    };
    if (activeTab === 'content') fetchPageContent();
  }, [activeTab, activePage]);

  const handleSaveProduct = async () => {
    setIsSaving(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: formData.createdAt || Date.now()
        })
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success(editingId ? 'Product updated' : 'Product created');
      setEditingId(null);
      setFormData({
        name: { en: '', pt: '' },
        slug: '',
        category: '',
        subCategory: '',
        rentalPrice: 0,
        description: { en: '', pt: '' },
        shortDescription: { en: '', pt: '' },
        specifications: [],
        images: [],
        inStock: true,
        status: 'available'
      });
      fetchInitialData();
      setActiveTab('products');
    } catch (e) {
      toast.error('Error saving product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData(p);
    setActiveTab('parser'); // Open the editor
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      fetchInitialData();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const savePageContent = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/content/${activePage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: pageContent })
      });
      toast.success('Page content updated');
    } catch (e) {
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

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
      toast.success('AI parsed info successfully!');
    } catch (error) {
      toast.error('AI parsing failed');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen nordic-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'products', icon: Package, label: 'Catalog' },
              { id: 'categories', icon: Layers, label: 'Categories' },
              { id: 'content', icon: FileText, label: 'Pages CMS' },
              { id: 'parser', icon: Sparkles, label: editingId ? 'Edit Item' : 'AI Parser' },
            ].map(item => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start rounded-xl"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Card className="glass-panel border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                      <CardDescription className="text-3xl font-bold text-foreground">{products.length}</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="glass-panel border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                      <CardDescription className="text-3xl font-bold text-foreground">{categories.length}</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="glass-panel border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                      <CardDescription className="text-3xl font-bold text-primary">Live</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="glass-panel border-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">System Sync</h3>
                      <p className="text-sm text-muted-foreground">Ensure your Vercel Postgres schema is up to date.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-primary/30 text-primary hover:bg-primary/5 rounded-xl"
                      onClick={async () => {
                        const res = await fetch('/api/init-db');
                        const data = await res.json();
                        toast.success(data.message);
                      }}
                    >
                      Initialize System
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Catalog Management</h2>
                  <Button className="rounded-xl" onClick={() => { 
                    setEditingId(null); 
                    setFormData({ name: { en: '', pt: '' }, slug: '', category: '', images: [], inStock: true });
                    setActiveTab('parser'); 
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Item
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {products.map(p => (
                    <Card key={p.id} className="glass-panel border-white/5 hover:border-white/10 transition-colors">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold">{p.name.en}</h4>
                            <p className="text-xs text-muted-foreground">{p.category} {p.subCategory && `› ${p.subCategory}`}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(p)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteProduct(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <CategoryManager 
                categories={categories} 
                onUpdate={fetchInitialData} 
              />
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="flex space-x-4">
                  {['home', 'about', 'services', 'contact'].map(page => (
                    <Button
                      key={page}
                      variant={activePage === page ? 'secondary' : 'outline'}
                      className="rounded-full px-6"
                      onClick={() => setActivePage(page)}
                    >
                      {page.charAt(0).toUpperCase() + page.slice(1)}
                    </Button>
                  ))}
                </div>

                <Card className="glass-panel border-white/10 p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold capitalize">{activePage} Content</h3>
                    <Button className="orange-glow" onClick={savePageContent} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Page Changes
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <Label>Hero Title (English)</Label>
                      <Input 
                        value={pageContent.heroTitle_en || ''} 
                        onChange={e => setPageContent({...pageContent, heroTitle_en: e.target.value})}
                        className="glass-panel border-white/10"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Hero Subtitle (English)</Label>
                      <Textarea 
                        value={pageContent.heroSubtitle_en || ''} 
                        onChange={e => setPageContent({...pageContent, heroSubtitle_en: e.target.value})}
                        className="glass-panel border-white/10"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Featured Image URL</Label>
                      <div className="flex space-x-4">
                        <Input 
                          value={pageContent.heroImage || ''} 
                          onChange={e => setPageContent({...pageContent, heroImage: e.target.value})}
                          className="glass-panel border-white/10"
                        />
                        <AssetUploader onUpload={url => setPageContent({...pageContent, heroImage: url})} label="Change Image" />
                      </div>
                      {pageContent.heroImage && (
                        <img src={pageContent.heroImage} alt="" className="w-full h-48 object-cover rounded-2xl border border-white/5" />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'parser' && (
              <div className="space-y-8">
                {!editingId && (
                  <Card className="glass-panel border-white/5 overflow-hidden">
                    <div className="bg-primary/10 p-6 border-b border-white/5 flex items-center space-x-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-bold">Gemini AI Assistant</h3>
                        <p className="text-xs text-muted-foreground">Describe your tool to auto-generate details.</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Textarea
                          placeholder="e.g. Diamond Saw for concrete, 300mm, highly reliable Nordic quality..."
                          className="min-h-[120px] glass-panel border-white/10 rounded-xl"
                          value={parseInput}
                          onChange={(e) => setParseInput(e.target.value)}
                        />
                        <Button 
                          className="w-full bg-primary orange-glow rounded-xl"
                          onClick={handleParse}
                          disabled={isParsing || !parseInput.trim()}
                        >
                          {isParsing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                          Generate with AI
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="glass-panel border-white/5 p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Item Details'}</h3>
                    {editingId && <Button variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label>Name (EN)</Label>
                      <Input value={formData.name?.en} onChange={e => setFormData({...formData, name: {...formData.name!, en: e.target.value}})} className="glass-panel" />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (PT)</Label>
                      <Input value={formData.name?.pt} onChange={e => setFormData({...formData, name: {...formData.name!, pt: e.target.value}})} className="glass-panel" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full h-10 px-3 glass-panel border-white/10 rounded-xl bg-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.name_en}>{c.name_en}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                       <Label>Price (€)</Label>
                       <Input type="number" value={formData.rentalPrice} onChange={e => setFormData({...formData, rentalPrice: Number(e.target.value)})} className="glass-panel" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Product Images / Media</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {formData.images?.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                          <img src={url} className="w-full h-full object-cover" />
                          <button 
                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setFormData({...formData, images: formData.images?.filter((_, i) => i !== idx)})}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <AssetUploader onUpload={url => setFormData({...formData, images: [...(formData.images || []), url]})} label="Add Image/Video" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8">
                    <Button className="orange-glow px-12" onClick={handleSaveProduct} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save to Database
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function CategoryManager({ categories, onUpdate }: { categories: DB_Category[], onUpdate: () => void }) {
  const [newCat, setNewCat] = useState({ name_en: '', name_pt: '', type: 'product' as const, parent_id: null as number | null });
  const [isSaving, setIsSaving] = useState(false);

  const saveCategory = async () => {
    setIsSaving(true);
    try {
      const slug = newCat.name_en.toLowerCase().replace(/\s+/g, '-');
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCat, slug })
      });
      toast.success('Category added');
      setNewCat({ name_en: '', name_pt: '', type: 'product', parent_id: null });
      onUpdate();
    } catch (e) {
      toast.error('Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Delete this category? Items might lose their link.')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      onUpdate();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="glass-panel border-white/10 p-6 space-y-4">
        <h3 className="font-bold">Add New Category / Subcategory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input placeholder="Name (EN)" value={newCat.name_en} onChange={e => setNewCat({...newCat, name_en: e.target.value})} className="glass-panel" />
          <Input placeholder="Name (PT)" value={newCat.name_pt} onChange={e => setNewCat({...newCat, name_pt: e.target.value})} className="glass-panel" />
          <select 
            value={newCat.parent_id || ''} 
            onChange={e => setNewCat({...newCat, parent_id: e.target.value ? Number(e.target.value) : null})}
            className="h-10 px-3 glass-panel border-white/10 rounded-xl bg-transparent"
          >
            <option value="">No Parent (Main Category)</option>
            {categories.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </select>
          <Button onClick={saveCategory} disabled={isSaving} className="orange-glow">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold">Existing Structure</h3>
        {categories.filter(c => !c.parent_id).map(parent => (
          <div key={parent.id} className="space-y-2">
            <div className="flex items-center justify-between p-4 glass-panel border-white/5 rounded-2xl">
              <span className="font-bold">{parent.name_en}</span>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteCategory(parent.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {categories.filter(c => c.parent_id === parent.id).map(sub => (
              <div key={sub.id} className="ml-8 flex items-center justify-between p-3 glass-panel border-primary/10 rounded-xl">
                <span className="text-sm">{sub.name_en}</span>
                <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => deleteCategory(sub.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

