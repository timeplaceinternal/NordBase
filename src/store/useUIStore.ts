import { create } from 'zustand';
import { Language } from '../types';

interface UIStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.shop': 'Shop',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.title': 'Nordic Reliability in Algarve',
    'hero.subtitle': 'Premium equipment catalog and specialized construction services.',
    'hero.cta': 'Explore Catalog',
    'shop.title': 'Equipment Catalog',
    'shop.filters': 'Filters',
    'shop.category': 'Category',
    'shop.price': 'Price',
    'shop.rent_now': 'View Details',
    'product.per_day': '',
    'product.book': 'Inquire Now',
    'product.specs': 'Specifications',
    'product.description': 'Description',
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.add_product': 'Add Product',
    'admin.ai_parser': 'AI Parser',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
  pt: {
    'nav.shop': 'Loja',
    'nav.services': 'Serviços',
    'nav.about': 'Sobre',
    'nav.contact': 'Contacto',
    'nav.admin': 'Admin',
    'hero.title': 'Fiabilidade Nórdica no Algarve',
    'hero.subtitle': 'Catálogo de equipamentos premium e serviços de construção especializados.',
    'hero.cta': 'Explorar Catálogo',
    'shop.title': 'Catálogo de Equipamentos',
    'shop.filters': 'Filtros',
    'shop.category': 'Categoria',
    'shop.price': 'Preço',
    'shop.rent_now': 'Ver Detalhes',
    'product.per_day': '',
    'product.book': 'Solicitar Informações',
    'product.specs': 'Especificações',
    'product.description': 'Descrição',
    'admin.dashboard': 'Painel',
    'admin.products': 'Produtos',
    'admin.add_product': 'Adicionar Produto',
    'admin.ai_parser': 'Parser AI',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
  },
};

export const useUIStore = create<UIStore>((set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  t: (key) => {
    const { language } = get();
    return translations[language][key as keyof typeof translations['en']] || key;
  },
}));
