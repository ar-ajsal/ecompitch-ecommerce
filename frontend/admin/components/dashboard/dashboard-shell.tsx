'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  navGroups, type StoreId, storeConfigs, formatCurrency,
  revenueData, orderStatus, countrySales, getModuleDescription,
} from '@/lib/dashboard-data'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'
import {
  ArrowDownRight, ArrowUpRight, Bell, Check, ChevronDown, ChevronRight,
  CircleHelp, Download, Ellipsis, Filter, Loader2, Menu, Moon, MoreHorizontal,
  Plus, Search, Sun, Trash2, Upload, X, Pencil,
} from 'lucide-react'
import {
  authApi, productApi, orderApi, uploadApi, categoriesApi, settingsApi,
  getToken, setToken, clearToken, getStoredUser, setStoredUser,
  type ApiProduct, type ApiOrder, type ApiCategory, type ApiSettings,
} from '@/lib/api'

type IconName = keyof typeof Icons
const Icon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const C = Icons[name as IconName] as React.ComponentType<{ size?: number; strokeWidth?: number }> | undefined
  return C ? <C size={size} strokeWidth={1.8} /> : <MoreHorizontal size={size} />
}

function MiniSpark({ positive = true }: { positive?: boolean }) {
  return <svg viewBox="0 0 82 28" className={cn('h-7 w-20', positive ? 'text-primary' : 'text-muted-foreground')} aria-hidden="true"><path d="M1 23 C8 18 10 21 16 17 S23 18 28 13 S35 16 40 10 S49 13 55 8 S65 11 81 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', { 'bg-muted text-muted-foreground': tone === 'neutral', 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': tone === 'success', 'bg-amber-500/10 text-amber-700 dark:text-amber-300': tone === 'warning', 'bg-rose-500/10 text-rose-600 dark:text-rose-400': tone === 'danger', 'bg-primary/10 text-primary': tone === 'info' })}>{children}</span>
}

function KpiCard({ label, value, change, detail, icon, positive = true }: { label: string; value: string; change: string; detail: string; icon: string; positive?: boolean }) {
  return <div className="rounded-xl border bg-card p-4 shadow-sm"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><span className="grid size-7 place-items-center rounded-md bg-muted text-foreground"><Icon name={icon} size={15} /></span>{label}</div><Ellipsis className="text-muted-foreground" size={16} /></div><div className="mt-4 flex items-end justify-between gap-2"><div><div className="text-2xl font-semibold tracking-tight">{value}</div><div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><span className={cn('inline-flex items-center font-medium', positive ? 'text-emerald-600' : 'text-rose-600')}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}</span>{detail}</div></div><MiniSpark positive={positive} /></div></div>
}

function RevenueChart() {
  const max = Math.max(...revenueData)
  const points = revenueData.map((value, i) => `${(i / (revenueData.length - 1)) * 100},${94 - (value / max) * 78}`).join(' ')
  return <div className="relative h-64 overflow-hidden"><div className="absolute inset-x-0 top-0 flex justify-between text-[10px] text-muted-foreground"><span>$12k</span><span>$9k</span><span>$6k</span><span>$3k</span><span>$0</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-7 top-7 h-[calc(100%-48px)] w-full"><defs><linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity=".22" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs><path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#revenue-fill)" /><polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg><div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-muted-foreground"><span>Aug 1</span><span>Aug 8</span><span>Aug 15</span><span>Aug 22</span><span>Today</span></div></div>
}

function StatusBars({ orders }: { orders: ApiOrder[] }) {
  const statusCounts = {
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  }
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1
  const statusData = [
    { label: 'Delivered', value: statusCounts.Delivered, color: '#5b5bd6' },
    { label: 'Processing', value: statusCounts.Processing, color: '#8b8bea' },
    { label: 'Shipped', value: statusCounts.Shipped, color: '#a7a7f0' },
    { label: 'Pending', value: statusCounts.Pending, color: '#d2d2f8' },
    { label: 'Cancelled', value: statusCounts.Cancelled, color: '#e7e7f4' },
  ]
  return <div className="flex h-64 items-center gap-6"><div className="relative grid size-40 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${statusData.map((item, i) => `${item.color} ${statusData.slice(0, i).reduce((a, b) => a + b.value, 0) / total * 100}% ${(statusData.slice(0, i + 1).reduce((a, b) => a + b.value, 0) / total * 100)}%`).join(',')})` }}><div className="grid size-24 place-items-center rounded-full bg-card"><div className="text-center"><div className="text-2xl font-semibold">{total}</div><div className="text-[10px] text-muted-foreground">total orders</div></div></div></div><div className="flex min-w-0 flex-1 flex-col gap-3">{statusData.map((item) => <div key={item.label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: item.color }} />{item.label}</span><span className="font-medium">{item.value}</span></div>)}</div></div>
}

function Panel({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={cn('rounded-xl border bg-card shadow-sm', className)}><div className="flex items-start justify-between gap-4 border-b px-5 py-4"><div><h2 className="text-sm font-semibold">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</div><div className="p-5">{children}</div></section>
}

// ─── API-driven Product Table ──────────────────────────────────────────────────
function ProductTable({ store, products, onDelete, onEdit, compact = false }: {
  store: StoreId
  products: ApiProduct[]
  onDelete?: (id: string) => void
  onEdit?: (product: ApiProduct) => void
  compact?: boolean
}) {
  const data = compact ? products.slice(0, 5) : products
  if (data.length === 0) return <div className="py-12 text-center text-xs text-muted-foreground">No products found</div>
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-xs">
        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="pb-3 font-medium">Product</th>
            <th className="pb-3 font-medium">SKU</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 text-right font-medium">Price</th>
            {!compact && (onDelete || onEdit) && <th className="pb-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((p) => (
            <tr key={p._id}>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt="" className="size-8 rounded-md object-cover" />
                  ) : (
                    <div className="size-8 rounded-md bg-muted" />
                  )}
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.brand} · {p.category}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-muted-foreground">{p.sku || '—'}</td>
              <td className="py-3">
                <Badge tone={p.stock < 5 ? 'danger' : p.stock < 15 ? 'warning' : 'success'}>{p.stock}</Badge>
              </td>
              <td className="py-3">
                <Badge tone={p.status === 'Active' ? 'success' : p.status === 'Draft' ? 'warning' : 'neutral'}>{p.status}</Badge>
              </td>
              <td className="py-3 text-right font-medium">
                {p.salePrice ? (
                  <span>{formatCurrency(p.salePrice, store)}</span>
                ) : (
                  <span>{formatCurrency(p.price, store)}</span>
                )}
              </td>
              {!compact && (onDelete || onEdit) && (
                <td className="py-3 text-right">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors mr-2"
                      aria-label="Edit product"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                    onClick={() => onDelete(p._id)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label="Delete product"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── API-driven Order Table ────────────────────────────────────────────────────
function OrderTable({ store, orders, onStatusChange }: {
  store: StoreId
  orders: ApiOrder[]
  onStatusChange?: (id: string, status: string) => void
}) {
  if (orders.length === 0) return <div className="py-12 text-center text-xs text-muted-foreground">No orders found</div>
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-xs">
        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="pb-3 font-medium">Order</th>
            <th className="pb-3 font-medium">Customer</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Payment</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 text-right font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.slice(0, 10).map((o) => {
            const customerName = typeof o.user === 'object' ? o.user.name : 'Customer'
            return (
              <tr key={o._id}>
                <td className="py-3 font-medium">#{o._id.slice(-6).toUpperCase()}</td>
                <td className="py-3">
                  <div>{customerName}</div>
                  <div className="text-[10px] text-muted-foreground">{o.shippingAddress?.city || ''}</div>
                </td>
                <td className="py-3 font-medium">{formatCurrency(o.total, store)}</td>
                <td className="py-3">
                  <Badge tone={o.paymentStatus === 'Paid' ? 'success' : o.paymentStatus === 'Refunded' ? 'danger' : 'warning'}>
                    {o.paymentStatus}
                  </Badge>
                </td>
                <td className="py-3">
                  {onStatusChange ? (
                    <select
                      value={o.status}
                      onChange={(e) => onStatusChange(o._id, e.target.value)}
                      className="rounded border bg-background px-1 py-0.5 text-[10px] outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge tone={o.status === 'Delivered' ? 'success' : o.status === 'Cancelled' ? 'danger' : 'info'}>{o.status}</Badge>
                  )}
                </td>
                <td className="py-3 text-right text-muted-foreground">{fmt(o.createdAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────
function Overview({ store, products, orders }: { store: StoreId; products: ApiProduct[]; orders: ApiOrder[] }) {
  const [period, setPeriod] = useState('30 days')
  const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0)
  const lowStock = products.filter(p => p.stock < 12)

  return <>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {[
        ['Revenue', formatCurrency(totalRevenue, store), '+18.4%', 'from paid orders', 'Banknote'],
        ['Orders', String(orders.length), '+12.8%', 'total orders', 'ShoppingBag'],
        ['Products', String(products.length), '+4.6%', 'in catalog', 'Package'],
        ['Active', String(products.filter(p => p.status === 'Active').length), '', 'active listings', 'CheckCircle'],
        ['Low Stock', String(lowStock.length), '', 'need attention', 'TriangleAlert', false],
        ['Avg. Order', orders.length ? formatCurrency(totalRevenue / Math.max(orders.filter(o => o.paymentStatus === 'Paid').length, 1), store) : '₹0', '+2.1%', 'per paid order', 'ReceiptText'],
      ].map(([label, value, change, detail, icon, positive], i) => (
        <KpiCard key={i} label={label as string} value={value as string} change={change as string} detail={detail as string} icon={icon as string} positive={positive !== false} />
      ))}
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
      <Panel title="Revenue overview" subtitle="Net revenue across all channels" action={
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {['7 days', '30 days', '3 months', '12 months'].map((item) => (
            <button key={item} onClick={() => setPeriod(item)} className={cn('rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors', period === item ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>{item}</button>
          ))}
        </div>
      }><RevenueChart /></Panel>
      <Panel title="Orders by status" subtitle="Current order lifecycle"><StatusBars orders={orders} /></Panel>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_1fr]">
      <Panel title="Top products" subtitle="Best performers in the selected period" action={<Button variant="ghost" size="sm" className="text-xs">View all <ChevronRight size={14} /></Button>}>
        <ProductTable store={store} products={products.sort((a, b) => b.sold - a.sold)} compact />
      </Panel>
      <Panel title="Sales by country" subtitle="Revenue contribution by market">
        <div className="flex flex-col gap-4">
          {countrySales.map((row) => (
            <div key={row.country}>
              <div className="mb-1.5 flex items-center justify-between text-xs"><span>{row.country}</span><span className="font-medium">{formatCurrency(row.revenue, store)}</span></div>
              <div className="h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${row.share * 2.5}%` }} /></div>
              <div className="mt-1 text-[10px] text-muted-foreground">{row.orders} orders · {row.share}% of revenue</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <Panel title="Recent orders" subtitle="Latest activity across your store" action={<Button variant="ghost" size="sm" className="text-xs">View all <ChevronRight size={14} /></Button>}>
        <OrderTable store={store} orders={orders} />
      </Panel>
      <Panel title="Low stock" subtitle="Products approaching reorder level" action={<Button variant="ghost" size="sm" className="text-xs">Inventory <ChevronRight size={14} /></Button>}>
        <div className="flex flex-col gap-3">
          {lowStock.slice(0, 5).map((p) => (
            <div key={p._id} className="flex items-center gap-3">
              {p.images?.[0] ? <img src={p.images[0].url} alt="" className="size-9 rounded-lg object-cover" /> : <div className="size-9 rounded-lg bg-muted" />}
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.sku || p.category}</div>
              </div>
              <Badge tone={p.stock < 6 ? 'danger' : 'warning'}>{p.stock} left</Badge>
            </div>
          ))}
          {lowStock.length === 0 && <div className="py-4 text-center text-xs text-muted-foreground">All products are well-stocked</div>}
        </div>
      </Panel>
    </div>
  </>
}

// ─── Module View (Products, Orders, etc.) ─────────────────────────────────────
function ModuleView({ active, store, onToast, products, orders, onProductDelete, onProductEdit, onOrderStatusChange, onAddProduct }: {
  active: string
  store: StoreId
  onToast: (message: string) => void
  products: ApiProduct[]
  orders: ApiOrder[]
  onProductDelete: (id: string) => void
  onOrderStatusChange: (id: string, status: string) => void
  onAddProduct: () => void
}) {
  const [query, setQuery] = useState('')

  const filteredProducts = products.filter(p =>
    JSON.stringify(p).toLowerCase().includes(query.toLowerCase())
  )
  const filteredOrders = orders.filter(o =>
    JSON.stringify(o).toLowerCase().includes(query.toLowerCase())
  )

  const isProducts = active === 'Products'
  const isOrders = active === 'Orders'

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium text-primary">Configuration-driven module</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{active}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{getModuleDescription(active)}</p>
          </div>
          <Button onClick={() => isProducts ? onAddProduct() : onToast(`${active} settings saved.`)}>
            <Plus size={15} /> {isProducts ? 'Add product' : 'Create new'}
          </Button>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${active.toLowerCase()}...`} className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter size={14} /> Filters</Button>
            <Button variant="outline" size="sm"><Download size={14} /> Export</Button>
          </div>
        </div>
        {isProducts ? (
          <div className="p-5">
            <ProductTable store={store} products={filteredProducts} onDelete={onProductDelete} onEdit={onProductEdit} />
          </div>
        ) : isOrders ? (
          <div className="p-5">
            <OrderTable store={store} orders={filteredOrders} onStatusChange={onOrderStatusChange} />
          </div>
        ) : (
          <div className="p-5 text-center text-sm text-muted-foreground py-12">
            Connect {active} data to the backend API to see live content here.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Product Form (Create) ────────────────────────────────────────────────────
function ProductForm({ onToast, onSaved, productToEdit }: { onToast: (message: string) => void; onSaved: () => void; productToEdit?: ApiProduct | null }) {
  const [specs, setSpecs] = useState([{ name: 'Material', value: '' }])
  const [variants, setVariants] = useState([{ name: 'Color', options: '' }])
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', sku: '', brand: '', category: 'Accessories',
    description: '', price: '', salePrice: '', stock: '', reorderLevel: '12',
    status: 'Active',
  })

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name,
        sku: productToEdit.sku || '',
        brand: productToEdit.brand || '',
        category: productToEdit.category,
        description: productToEdit.description || '',
        price: String(productToEdit.price),
        salePrice: productToEdit.salePrice ? String(productToEdit.salePrice) : '',
        stock: String(productToEdit.stock),
        reorderLevel: String(productToEdit.reorderLevel || 12),
        status: productToEdit.status,
      })
      setImages(productToEdit.images || [])
      if (productToEdit.specifications?.length) setSpecs(productToEdit.specifications)
      if (productToEdit.variants?.length) setVariants(productToEdit.variants)
    }
  }, [productToEdit])

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadApi.uploadImage(file)
      setImages(imgs => [...imgs, result])
      onToast('Image uploaded to Cloudinary.')
    } catch (err: any) {
      onToast(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) {
      onToast('Please fill in name, category, and price.')
      return
    }
    setSaving(true)
    try {
      await productApi.create({
        ...form,
        status: form.status as 'Active' | 'Draft' | 'Archived',
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock) || 0,
        reorderLevel: Number(form.reorderLevel) || 12,
        images,
        specifications: specs.filter(s => s.name && s.value),
        variants: variants.filter(v => v.name).map(v => ({ name: v.name, options: v.options.split(',').map(o => o.trim()).filter(Boolean) })),
      })
      onToast('✅ Product created successfully!')
      onSaved()
    } catch (err: any) {
      onToast(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-primary">Catalog / Products</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{productToEdit ? "Edit product" : "Create product"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Build a flexible product record for any category.</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {saving ? 'Saving…' : productToEdit ? 'Update product' : 'Save product'}
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Basic information" subtitle="The essentials customers see first">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium">Product name<input name="name" value={form.name} onChange={handleField} className="field" placeholder="e.g. Everyday Carry Pouch" /></label>
            <label className="text-xs font-medium">SKU<input name="sku" value={form.sku} onChange={handleField} className="field" placeholder="NG-EC-104" /></label>
            <label className="text-xs font-medium">Brand<input name="brand" value={form.brand} onChange={handleField} className="field" placeholder="Morrow" /></label>
            <label className="text-xs font-medium">Category
              <select name="category" value={form.category} onChange={handleField} className="field">
                {['Accessories', 'Electronics', 'Apparel', 'Gear', 'Technology', 'Audio', 'Home Office', 'Lifestyle', 'Bags', 'Watches', 'Stationery'].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium sm:col-span-2">Description<textarea name="description" value={form.description} onChange={handleField} className="field min-h-28" placeholder="Describe the product, materials, and use cases." /></label>
          </div>
        </Panel>
        <Panel title="Media" subtitle="Upload product images to Cloudinary">
          <div className="grid grid-cols-3 gap-2">
            <label className={cn('grid aspect-square place-items-center rounded-lg border border-dashed bg-muted/50 text-center text-[10px] text-muted-foreground cursor-pointer hover:bg-muted transition-colors', uploading && 'opacity-50 pointer-events-none')}>
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <><Upload size={18} /><span className="mt-1">Upload image</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square">
                <img src={img.url} alt="Product" className="aspect-square rounded-lg object-cover" />
                <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-white"><X size={10} /></button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">PNG, JPG or WEBP up to 10MB. Images stored in Cloudinary.</p>
        </Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Pricing & inventory" subtitle="Pricing can be localized per store">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium">Base price<input name="price" value={form.price} onChange={handleField} className="field" placeholder="₹ 0.00" /></label>
            <label className="text-xs font-medium">Sale price<input name="salePrice" value={form.salePrice} onChange={handleField} className="field" placeholder="₹ 0.00" /></label>
            <label className="text-xs font-medium">Stock quantity<input name="stock" value={form.stock} onChange={handleField} className="field" placeholder="0" /></label>
            <label className="text-xs font-medium">Reorder level<input name="reorderLevel" value={form.reorderLevel} onChange={handleField} className="field" placeholder="12" /></label>
            <label className="text-xs font-medium">Status
              <select name="status" value={form.status} onChange={handleField} className="field">
                <option>Active</option><option>Draft</option><option>Archived</option>
              </select>
            </label>
          </div>
        </Panel>
        <Panel title="Specifications" subtitle="Use any attributes your category requires" action={<Button variant="outline" size="sm" onClick={() => setSpecs([...specs, { name: '', value: '' }])}><Plus size={13} /> Add row</Button>}>
          <div className="space-y-2">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input className="field" value={spec.name} onChange={(e) => setSpecs(specs.map((s, j) => j === i ? { ...s, name: e.target.value } : s))} placeholder="Specification name" />
                <input className="field" value={spec.value} onChange={(e) => setSpecs(specs.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} placeholder="Value" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Variants" subtitle="Create custom attributes without hardcoded product types" action={<Button variant="outline" size="sm" onClick={() => setVariants([...variants, { name: '', options: '' }])}><Plus size={13} /> Add attribute</Button>}>
        <div className="space-y-3">
          {variants.map((variant, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
              <input className="field" value={variant.name} onChange={(e) => setVariants(variants.map((v, j) => j === i ? { ...v, name: e.target.value } : v))} placeholder="Attribute e.g. Color" />
              <input className="field" value={variant.options} onChange={(e) => setVariants(variants.map((v, j) => j === i ? { ...v, options: e.target.value } : v))} placeholder="Options separated by commas" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('admin@bharatbazaar.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await authApi.login(email, password)
      if (user.role !== 'admin') {
        setError('This account does not have admin access.')
        return
      }
      setToken(user.token)
      setStoredUser(user)
      onLogin(user)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="text-sm font-bold">N</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Bharat Bazaar</div>
              <div className="text-[10px] text-muted-foreground">Commerce command center</div>
            </div>
          </div>
          <h1 className="mb-1 text-xl font-semibold">Admin sign in</h1>
          <p className="mb-6 text-xs text-muted-foreground">Sign in with your administrator account.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-medium">
              Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="field mt-1" required />
            </label>
            <label className="block text-xs font-medium">
              Password
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="field mt-1" required placeholder="••••••••" />
            </label>
            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard Shell ─────────────────────────────────────────────────────
export default function DashboardShell() {
  const [store, setStore] = useState<StoreId>('gadgets')
  const [active, setActive] = useState('Overview')
  const [drawer, setDrawer] = useState(false)
  const [dark, setDark] = useState(false)
  const [toast, setToast] = useState('')
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // API state
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [dataError, setDataError] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ApiProduct | null>(null)

  // ── Theme ──
  useEffect(() => {
    const saved = window.localStorage.getItem('dashboard-theme')
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark') }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('dashboard-theme', dark ? 'dark' : 'light')
  }, [dark])

  // ── Toast auto-clear ──
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  // ── Auth check ──
  useEffect(() => {
    const token = getToken()
    const stored = getStoredUser()
    if (token && stored) {
      setUser(stored)
    }
    setAuthChecked(true)
  }, [])

  // ── Load data after login ──
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true)
    setDataError('')
    try {
      const res = await productApi.getAll()
      setProducts(res.products)
    } catch (err: any) {
      setDataError(err.message)
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const res = await orderApi.getAll()
      setOrders(res.orders)
    } catch (err: any) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadProducts()
      loadOrders()
    }
  }, [user, loadProducts, loadOrders])

  // ── Handlers ──
  const handleProductDelete = async (id: string) => {
    if (!confirm('Delete this product? This will also remove its Cloudinary images.')) return
    try {
      await productApi.delete(id)
      setProducts(ps => ps.filter(p => p._id !== id))
      setToast('Product deleted.')
    } catch (err: any) {
      setToast(`Error: ${err.message}`)
    }
  }

  const handleOrderStatusChange = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status)
      setOrders(os => os.map(o => o._id === id ? { ...o, status: status as any } : o))
      setToast(`Order status updated to ${status}.`)
    } catch (err: any) {
      setToast(`Error: ${err.message}`)
    }
  }

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setProducts([])
    setOrders([])
  }

  const choose = (item: string) => { setActive(item); setDrawer(false); setShowProductForm(false) }

  // ── Auth gate ──
  if (!authChecked) return null
  if (!user) return <LoginScreen onLogin={handleLogin} />

  const config = storeConfigs[store]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0', drawer ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><span className="text-sm font-bold">N</span></div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Bharat Bazaar</div>
              <div className="text-[10px] text-sidebar-foreground/60">Commerce command center</div>
            </div>
          </div>
          <button onClick={() => setDrawer(false)} className="lg:hidden" aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="border-b border-sidebar-border p-3">
          <button className="flex w-full items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-left" aria-label="Switch store">
            <div className="grid size-7 place-items-center rounded-md text-xs font-semibold" style={{ backgroundColor: config.accent, color: '#fff' }}>{config.short}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{config.name}</div>
              <div className="truncate text-[10px] text-sidebar-foreground/60">{config.currency} · {config.subtitle}</div>
            </div>
            <ChevronDown size={15} className="text-sidebar-foreground/60" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map(group => (
            <div key={group.label} className="mb-5">
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-sidebar-foreground/40">{group.label}</div>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <button key={item.label} onClick={() => choose(item.label)} className={cn('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors', active === item.label ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground')}>
                    <Icon name={item.icon} size={15} /><span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="grid size-7 place-items-center rounded-full bg-sidebar-primary text-[10px] font-semibold text-sidebar-primary-foreground">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{user.name}</div>
              <div className="truncate text-[10px] text-sidebar-foreground/50">Administrator</div>
            </div>
            <button onClick={handleLogout} title="Sign out" className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"><X size={15} /></button>
          </div>
        </div>
      </aside>

      {drawer && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setDrawer(false)} aria-label="Close navigation overlay" />}

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={18} /></Button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span>Workspace</span><ChevronRight size={14} /><span className="font-medium text-foreground">{active}</span>
            </div>
            <div className="sm:hidden text-sm font-semibold">{active}</div>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input className="h-8 w-48 rounded-lg border bg-card pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search anything" />
            </div>
            <Button variant="ghost" size="icon" aria-label="Help"><CircleHelp size={17} /></Button>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell size={17} /></Button>
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</Button>
            <div className="ml-1 hidden size-8 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground sm:grid">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-1 text-[11px] font-medium text-muted-foreground">Good morning, {user.name?.split(' ')[0] || 'Admin'}</div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {active === 'Overview' ? 'Your store at a glance.' : showProductForm ? 'Create product' : active}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {active === 'Overview'
                  ? 'A clear view of performance, activity, and opportunities across your commerce workspace.'
                  : getModuleDescription(active)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select aria-label="Demo store" value={store} onChange={(e) => setStore(e.target.value as StoreId)} className="h-9 rounded-lg border bg-card px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20">
                {Object.entries(storeConfigs).map(([id, item]) => <option key={id} value={id}>{item.name} · {item.currency}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={() => setToast('Report exported as CSV.')}>
                <Download size={14} /> <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {loadingProducts && (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 size={24} className="animate-spin mr-3" /> Loading data…
            </div>
          )}

          {/* Error state */}
          {dataError && !loadingProducts && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
              <p className="font-medium">Failed to load data</p>
              <p className="mt-1 text-xs">{dataError}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={loadProducts}>Retry</Button>
            </div>
          )}

          {!loadingProducts && !dataError && (
            <>
              {active === 'Overview' && <Overview store={store} products={products} orders={orders} />}
              {active === 'Categories' && <CategoriesView onToast={setToast} />}
              {active === 'Settings' && <SettingsView onToast={setToast} />}
              {active === 'Add Product' && <ProductForm productToEdit={productToEdit} onToast={setToast} onSaved={() => { setActive('Products'); loadProducts() }} />}
              {showProductForm && active !== 'Add Product' && <ProductForm productToEdit={productToEdit} onToast={setToast} onSaved={() => { setShowProductForm(false); loadProducts() }} />}
              {!showProductForm && active !== 'Overview' && active !== 'Categories' && active !== 'Settings' && active !== 'Add Product' && (
                <ModuleView
                  active={active}
                  store={store}
                  onToast={setToast}
                  products={products}
                  orders={orders}
                  onProductDelete={handleProductDelete}
                  onOrderStatusChange={handleOrderStatusChange}
                  onAddProduct={() => { setProductToEdit(null); setShowProductForm(true); }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-xs text-background shadow-lg">
          <Check size={15} className="text-emerald-400" />{toast}
        </div>
      )}
    </div>
  )
}


// ─── Categories View ────────────────────────────────────────────────────────
export function CategoriesView({ onToast }: { onToast: (message: string) => void }) {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', featured: false })
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const load = () => categoriesApi.getAll().then(setCategories).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.uploadImage(file)
      setImage(res)
    } catch (err: any) {
      onToast(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !image) { onToast('Name and image are required'); return }
    try {
      await categoriesApi.create({ ...form, image })
      onToast('Category created')
      setForm({ name: '', description: '', featured: false })
      setImage(null)
      load()
    } catch (err: any) { onToast(err.message) }
  }

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.delete(id)
      onToast('Category deleted')
      load()
    } catch (err: any) { onToast(err.message) }
  }

  return (
    <div className="p-5 space-y-8 text-sm">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Create new category</h3>
          <div className="flex flex-col gap-3">
            <input placeholder="Category name (e.g. Technology)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-9 rounded-md border px-3" />
            <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="h-9 rounded-md border px-3" />
            <div className="flex items-center gap-4 mt-2">
              <label className="flex h-20 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 hover:bg-muted transition-colors">
                {uploading ? <Loader2 className="animate-spin text-muted-foreground" size={20} /> : image ? <img src={image.url} className="h-full w-full object-cover rounded-lg" /> : <><Upload className="mb-2 text-muted-foreground" size={20} /><span className="text-[10px] text-muted-foreground">Upload image</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              <Button onClick={handleSubmit} disabled={uploading || !form.name || !image}>Add Category</Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base mb-4">Existing Categories</h3>
          {loading ? <div className="py-4 text-muted-foreground">Loading...</div> : (
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c._id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                  <div className="flex items-center gap-3">
                    {c.image?.url && <img src={c.image.url} className="h-8 w-8 rounded object-cover" />}
                    <div className="font-medium">{c.name}</div>
                  </div>
                  <button onClick={() => handleDelete(c._id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </div>
              ))}
              {categories.length === 0 && <div className="text-muted-foreground">No categories found.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Settings View ──────────────────────────────────────────────────────────
export function SettingsView({ onToast }: { onToast: (message: string) => void }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ heroTitle: '', heroSubtitle: '' })
  const [media, setMedia] = useState<{ url: string; publicId: string; type: 'image' | 'video' } | null>(null)
  const [waEnabled, setWaEnabled] = useState(false)
  const [waNumber, setWaNumber] = useState('')
  const [payEnabled, setPayEnabled] = useState(false)

  useEffect(() => {
    settingsApi.get().then(s => {
      setForm({ heroTitle: s?.heroTitle || '', heroSubtitle: s?.heroSubtitle || '' })
      setMedia(s?.heroMedia || null)
      setWaEnabled(s?.whatsappEnabled ?? false)
      setWaNumber(s?.whatsappNumber || '')
      setPayEnabled(s?.onlinePaymentEnabled ?? false)
    }).finally(() => setLoading(false))
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.uploadImage(file)
      const isVideo = file.type.startsWith('video/')
      setMedia({ ...res, type: isVideo ? 'video' : 'image' })
    } catch (err: any) {
      onToast(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsApi.update({
        ...form,
        heroMedia: media,
        whatsappEnabled: waEnabled,
        whatsappNumber: waNumber.trim(),
        onlinePaymentEnabled: payEnabled,
      } as any)
      onToast('Settings saved successfully')
    } catch (err: any) {
      onToast(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) => (
    <button
      onClick={onToggle}
      aria-label={label}
      style={{
        position: 'relative', display: 'inline-flex', width: '44px', height: '24px',
        borderRadius: '12px', background: on ? '#16a34a' : '#d1d5db',
        cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0, border: 'none', padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: on ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )

  return (
    <div className="p-5 max-w-2xl text-sm space-y-8">

      <div>
        <h3 className="font-semibold text-base border-b pb-2 mb-4">Purchase Options</h3>
        <p className="text-xs text-muted-foreground mb-5">Control which ordering methods appear to customers. Changes take effect after saving.</p>

        <div className="rounded-xl border bg-card p-4 mb-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span className="font-semibold text-sm">WhatsApp Support</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${waEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{waEnabled ? 'ENABLED' : 'DISABLED'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shows "Buy via WhatsApp" button and a floating chat button on the storefront.</p>
              {waEnabled && (
                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">WhatsApp Number (E.164 — e.g. 919745107425)</label>
                  <input value={waNumber} onChange={e => setWaNumber(e.target.value)} placeholder="919745107425" className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none" />
                  <p className="text-[10px] text-muted-foreground mt-1">No +, no spaces, no dashes. Country code + number.</p>
                </div>
              )}
            </div>
            <Toggle on={waEnabled} onToggle={() => setWaEnabled(v => !v)} label="Toggle WhatsApp" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span className="font-semibold text-sm">Online Payment (Cashfree)</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${payEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{payEnabled ? 'ENABLED' : 'DISABLED'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Customers pay via UPI, cards, or EMI using Cashfree. Credentials are stored in backend environment variables.</p>
              {payEnabled ? (
                <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-700">Checkout &amp; Pay Online button active in the cart.</div>
              ) : (
                <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-700">Payment button disabled — customers will not see it.</div>
              )}
            </div>
            <Toggle on={payEnabled} onToggle={() => setPayEnabled(v => !v)} label="Toggle Payment" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-base border-b pb-2 mb-4">Storefront Homepage Hero</h3>
        {loading ? <div className="py-4 text-muted-foreground">Loading settings...</div> : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hero Title</label>
              <input value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} className="w-full h-9 rounded-md border px-3 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hero Subtitle</label>
              <input value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))} className="w-full h-9 rounded-md border px-3 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Hero Background (Image or Video)</label>
              <label className="flex h-24 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 hover:bg-muted transition-colors relative overflow-hidden">
                {uploading ? <Loader2 className="animate-spin text-muted-foreground" size={20} /> : media ? (
                  media.type === 'video' ? <video src={media.url} className="h-full w-full object-cover" muted /> : <img src={media.url} className="h-full w-full object-cover" />
                ) : <><Upload className="mb-2 text-muted-foreground" size={20} /><span className="text-[10px] text-muted-foreground">Upload Media</span></>}
                <input type="file" accept="image/*,video/mp4" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 size={15} className="animate-spin mr-1" /> : <Check size={15} className="mr-1" />}
        {saving ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  )
}
