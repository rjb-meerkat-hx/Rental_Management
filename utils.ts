/**
 * Format number as Indian Rupee currency
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Normalize product field names from server (snake_case) to frontend (camelCase)
 */
export const normalizeProduct = (product: any) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  image: product.image,
  pricePerDay: product.price_per_day || product.pricePerDay || 0,
  pricePerHour: product.price_per_hour || product.pricePerHour || 0,
  stock: product.stock || 0,
  available: product.available || 0,
  createdAt: product.created_at,
  updatedAt: product.updated_at
});

/**
 * Convert product to server format (camelCase to snake_case)
 */
export const denormalizeProduct = (product: any) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  image: product.image,
  price_per_day: product.pricePerDay || 0,
  price_per_hour: product.pricePerHour || 0,
  stock: product.stock || 0,
  available: product.available || 0
});
