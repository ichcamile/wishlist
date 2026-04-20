export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const cleanStr = priceStr.replace(/[^\d.,]/g, '');
  if (!cleanStr) return 0;
  const standardStr = cleanStr.replace(/\./g, '').replace(',', '.');
  return parseFloat(standardStr) || 0;
};

export const formatPrice = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const CATEGORIES = ['Moda', 'Beleza', 'Acessórios', 'Tênis', 'Casa', 'Eletrônicos', 'Outros'];
