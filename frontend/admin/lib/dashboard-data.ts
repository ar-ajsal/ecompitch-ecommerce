// dashboard-data.ts
// Static configuration, chart data, utility functions, and type definitions.
// Live products and orders are now fetched from the backend API.

export type StoreId = 'gadgets' | 'audio' | 'mobile' | 'fashion'

export const storeConfigs = {
  gadgets: { name: 'Bharat Bazaar', short: 'BB', currency: 'INR', symbol: '₹', accent: '#e87522', subtitle: 'India commerce operations' },
  audio: { name: 'Aural House', short: 'AH', currency: 'EUR', symbol: '€', accent: '#a34c25', subtitle: 'Audio retail operations' },
  mobile: { name: 'Loop Supply', short: 'LS', currency: 'AED', symbol: 'د.إ', accent: '#087f7a', subtitle: 'Mobile accessories' },
  fashion: { name: 'Morrow Studio', short: 'MS', currency: 'GBP', symbol: '£', accent: '#8a496b', subtitle: 'Modern fashion retail' },
} as const

export const formatCurrency = (value: number, store: StoreId) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: storeConfigs[store].currency,
    maximumFractionDigits: 0,
  }).format(value)

export const navGroups = [
  { label: 'Workspace', items: [{ label: 'Overview', icon: 'LayoutDashboard' }, { label: 'Sales & Analytics', icon: 'ChartNoAxesCombined' }] },
  { label: 'Catalog', items: [{ label: 'Products', icon: 'Package' }, { label: 'Add Product', icon: 'Plus' }, { label: 'Categories', icon: 'Tags' }] },
  { label: 'Sales', items: [{ label: 'Orders', icon: 'ShoppingBag' }, { label: 'Invoice Generator', icon: 'ReceiptText' }] },
  { label: 'Audience', items: [{ label: 'Customers', icon: 'Users' }] },
]

export const revenueData = [38, 44, 41, 52, 49, 57, 54, 61, 63, 59, 72, 69, 78, 75, 84, 80, 91, 88, 94, 102, 98, 110, 106, 118]

// Static chart colors — used in the conic-gradient, will be dynamically computed from real order counts
export const orderStatus = [
  { label: 'Delivered', value: 0, color: '#5b5bd6' },
  { label: 'Processing', value: 0, color: '#8b8bea' },
  { label: 'Shipped', value: 0, color: '#a7a7f0' },
  { label: 'Pending', value: 0, color: '#d2d2f8' },
  { label: 'Cancelled', value: 0, color: '#e7e7f4' },
]

export const countries = ['United States', 'India', 'United Kingdom', 'Spain', 'Canada', 'Italy', 'Australia', 'South Korea', 'Brazil']
export const countrySales = countries.slice(0, 5).map((country, i) => ({
  country,
  orders: [124, 82, 61, 44, 38][i],
  revenue: [18420, 12140, 8940, 6380, 5110][i],
  share: [38, 25, 18, 13, 6][i],
}))

export type NavGroup = (typeof navGroups)[number]
export type NavItem = NavGroup['items'][number]
export type StoreConfig = (typeof storeConfigs)[StoreId]

export const getModuleDescription = (active: string) =>
  ({
    'Sales Analytics': 'Understand revenue momentum, conversion, and customer behavior.',
    Products: 'Manage your catalog, pricing, stock, and product metadata.',
    'Add Product': 'Create a product with flexible variants and specifications.',
    Categories: 'Organize products into a hierarchy that fits your business.',
    Brands: 'Keep your brand catalog consistent across stores.',
    Reviews: 'Moderate customer feedback and product ratings.',
    Orders: 'Review, fulfill, and manage every customer order.',
    Returns: 'Track return requests from approval to completion.',
    Refunds: 'Monitor payment reversals and refund status.',
    Inventory: 'Keep availability accurate across every warehouse.',
    Customers: 'Understand your customers and lifetime value.',
    Coupons: 'Create targeted incentives and discount codes.',
    Campaigns: 'Coordinate campaigns across your commerce channels.',
    Countries: 'Configure markets, regions, and tax behavior.',
    Currencies: 'Set supported currencies and exchange rates.',
    Taxes: 'Configure regional tax rules.',
    'Shipping Zones': 'Create shipping methods and delivery estimates.',
    Settings: 'Control store identity, payments, and integrations.',
  } as Record<string, string>)[active] ?? 'Your commerce operations at a glance.'
