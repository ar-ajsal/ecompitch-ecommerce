'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Check, ChevronLeft, ChevronRight,
  Heart, Loader2, Minus, Plus, Share2, ShoppingBag, MessageCircle,
  Shield, Truck, RotateCcw, Star, X, Package
} from 'lucide-react'
import { productApi, type ApiProduct } from '@/lib/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

function discountPct(price: number, sale: number) {
  return Math.round(((price - sale) / price) * 100)
}

function buildWhatsAppLink(product: ApiProduct, qty: number, waNumber?: string): string {
  const num = waNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  if (!num) return ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const price = product.salePrice || product.price
  const msg = [
    `Hi, I would like to order this product.`,
    ``,
    `Product: ${product.name}`,
    `Product ID: #${product._id.slice(-6).toUpperCase()}`,
    `Price: ₹${price.toLocaleString('en-IN')}`,
    `Quantity: ${qty}`,
    `Total: ₹${(price * qty).toLocaleString('en-IN')}`,
    ``,
    `Product Link:`,
    `${origin}/product/${product._id}`,
  ].join('\n')
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div
      className="pdp-toast"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(14px)' }}
    >
      <Check size={13} strokeWidth={3} />
      {msg}
    </div>
  )
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating = 4.5 }: { rating?: number }) {
  return (
    <div className="pdp-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`pdp-star ${i <= Math.round(rating) ? 'pdp-star--on' : ''}`}>★</span>
      ))}
      <span className="pdp-rating-num">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function Gallery({ product }: { product: ApiProduct }) {
  const srcs = product.images?.length
    ? product.images.map(img => img.url)
    : ['/products/lyrix-watch.png']

  const [idx, setIdx] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zPos, setZPos] = useState({ x: 50, y: 50 })
  const [lb, setLb] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const prev = useCallback(() => setIdx(i => (i - 1 + srcs.length) % srcs.length), [srcs.length])
  const next = useCallback(() => setIdx(i => (i + 1) % srcs.length), [srcs.length])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setZPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  useEffect(() => {
    if (!lb) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [lb, prev, next])

  return (
    <div className="pdp-gallery">
      {/* Main image */}
      <div
        ref={ref}
        className={`pdp-main-img-wrap ${zoomed ? 'pdp-main-img-wrap--zoomed' : ''}`}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={onMove}
        onClick={() => setLb(true)}
      >
        {srcs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${product.name} — view ${i + 1}`}
            className="pdp-main-img"
            style={{
              objectFit: 'contain',
              opacity: i === idx ? 1 : 0,
              transform:
                zoomed && i === idx
                  ? `scale(1.7) translate(${(50 - zPos.x) * 0.28}%, ${(50 - zPos.y) * 0.28}%)`
                  : 'scale(1)',
            }}
          />
        ))}

        {srcs.length > 1 && (
          <>
            <button className="pdp-gallery-btn pdp-gallery-btn--l" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={15} />
            </button>
            <button className="pdp-gallery-btn pdp-gallery-btn--r" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={15} />
            </button>
          </>
        )}

        <span className="pdp-zoom-label">Click to zoom</span>

        {srcs.length > 1 && (
          <div className="pdp-dots">
            {srcs.map((_, i) => (
              <button key={i} className={`pdp-dot ${i === idx ? 'pdp-dot--on' : ''}`} onClick={e => { e.stopPropagation(); setIdx(i) }} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {srcs.length > 1 && (
        <div className="pdp-thumbs">
          {srcs.map((src, i) => (
            <button key={i} className={`pdp-thumb ${i === idx ? 'pdp-thumb--on' : ''}`} onClick={() => setIdx(i)}>
              <img src={src} alt={`View ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lb && (
        <div className="pdp-lb" onClick={() => setLb(false)}>
          <button className="pdp-lb-close" onClick={() => setLb(false)}><X size={16} /></button>
          {srcs.length > 1 && (
            <>
              <button className="pdp-lb-nav pdp-lb-nav--l" onClick={e => { e.stopPropagation(); prev() }}><ChevronLeft size={22} /></button>
              <button className="pdp-lb-nav pdp-lb-nav--r" onClick={e => { e.stopPropagation(); next() }}><ChevronRight size={22} /></button>
            </>
          )}
          <img src={srcs[idx]} alt={product.name} className="pdp-lb-img" onClick={e => e.stopPropagation()} />
          <span className="pdp-lb-count">{idx + 1} / {srcs.length}</span>
        </div>
      )}
    </div>
  )
}

// ─── Tabs (Description / Specs / Delivery) ────────────────────────────────────
function Tabs({ product }: { product: ApiProduct }) {
  type T = 'desc' | 'specs' | 'delivery'
  const [tab, setTab] = useState<T>('desc')

  const specs: { l: string; v: string }[] = [
    product.brand ? { l: 'Brand', v: product.brand } : null,
    { l: 'Category', v: product.category },
    product.sku ? { l: 'SKU', v: product.sku } : null,
    { l: 'Stock', v: product.stock > 0 ? `${product.stock} units available` : 'Out of stock' },
    ...(product.specifications || []).map(s => ({ l: s.name, v: s.value })),
  ].filter(Boolean) as { l: string; v: string }[]

  const delivery = [
    { icon: <Truck size={16} />, t: 'Free delivery', d: 'On orders above ₹2,000 · Estimated 3–5 business days.' },
    { icon: <MessageCircle size={16} />, t: 'Order via WhatsApp', d: "Tap 'Buy Now' to place your order directly with us on WhatsApp. We confirm and process every order personally." },
    { icon: <RotateCcw size={16} />, t: '7-day easy returns', d: 'Reach us within 7 days of delivery for a hassle-free return or exchange.' },
    { icon: <Shield size={16} />, t: '1-year warranty', d: 'Standard manufacturer warranty included on all products.' },
  ]

  return (
    <div className="pdp-tabs">
      <div className="pdp-tabs-nav">
        {([['desc', 'Description'], ['specs', 'Specifications'], ['delivery', 'Delivery & Returns']] as [T, string][]).map(([k, label]) => (
          <button key={k} className={`pdp-tabs-btn ${tab === k ? 'pdp-tabs-btn--on' : ''}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      <div className="pdp-tabs-body">
        {tab === 'desc' && (
          <p className="pdp-desc-text">{product.description || 'No description available for this product.'}</p>
        )}

        {tab === 'specs' && (
          specs.length > 0 ? (
            <table className="pdp-specs">
              <tbody>
                {specs.map(s => (
                  <tr key={s.l}>
                    <td className="pdp-specs-k">{s.l}</td>
                    <td className="pdp-specs-v">{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="pdp-empty">No specifications listed.</p>
        )}

        {tab === 'delivery' && (
          <div className="pdp-delivery">
            {delivery.map(d => (
              <div key={d.t} className="pdp-delivery-row">
                <div className="pdp-delivery-icon">{d.icon}</div>
                <div>
                  <div className="pdp-delivery-title">{d.t}</div>
                  <div className="pdp-delivery-sub">{d.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Product Story ────────────────────────────────────────────────────────────
function Story({ product }: { product: ApiProduct }) {
  const imgs = product.images?.map(i => i.url) || []
  if (!product.description && imgs.length < 2) return null

  return (
    <div className="pdp-story">
      {imgs[1] && (
        <div className="pdp-story-imgwrap">
          <img src={imgs[1]} alt={product.name} className="pdp-story-img" />
        </div>
      )}
      <div className="pdp-story-copy">
        <div className="pdp-story-eyebrow">Why you'll love it</div>
        <h2 className="pdp-story-h">{product.name}</h2>
        <p className="pdp-story-body">
          {product.description
            || `${product.name} is crafted with precision and care, designed to integrate seamlessly into your everyday life. A product that values quality over compromise.`}
        </p>
      </div>
    </div>
  )
}

// ─── Related Card ─────────────────────────────────────────────────────────────
function RelatedCard({ product, onAdd, onClick }: { product: ApiProduct; onAdd: (p: ApiProduct, qty: number) => void; onClick?: () => void }) {
  const [liked, setLiked] = useState(false)
  const img = product.images?.[0]?.url || '/products/lyrix-watch.png'
  const price = product.salePrice || product.price
  const off = product.salePrice ? discountPct(product.price, product.salePrice) : 0

  return (
    <a href="#" className="card pdp-rc" onClick={(e) => { e.preventDefault(); onClick?.(); }} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div className="card-media">
        {off > 0 && <div className="card-badges"><span className="badge badge-accent">Sale {off}% Off</span></div>}
        <button
          className="wish card-wish"
          onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(v => !v) }}
        >
          <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <img src={img} alt={product.name} className="solo" />
        <div className="card-quick" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(product, 1); }}>
          <span className="btn btn-dark btn-block">Add to cart</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-cat">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <div className="card-foot">
          <span className="price">{money(price)}</span>
          {product.salePrice && <span className="price-was" style={{marginLeft: 8, textDecoration: 'line-through', color: 'var(--muted)'}}>{money(product.price)}</span>}
        </div>
      </div>
    </a>
  )
}


const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="accordion-item" style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontSize: '16px', fontWeight: '600', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '20px', fontWeight: '400' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ paddingTop: '16px', color: 'var(--ink-2)', fontSize: '14px', lineHeight: '1.6' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetail({
  productId,
  onAdd,
  count,
  allProducts,
  settings,
  setShowCart,
  setActiveTab,
  setSelectedProduct,
}: {
  productId: string
  onAdd: (p: ApiProduct, qty: number) => void
  count: number
  allProducts: ApiProduct[]
  settings?: { whatsappEnabled?: boolean; whatsappNumber?: string; onlinePaymentEnabled?: boolean }
  setShowCart?: (b: boolean) => void
  setActiveTab?: (tab: string) => void
  setSelectedProduct?: (p: any) => void
}) {
  const [product, setProduct] = useState<ApiProduct | null>(
    allProducts?.find(p => p._id === productId) || null
  )
  const [loading, setLoading] = useState(!product)
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '' })

  useEffect(() => { setQty(1) }, [productId])

  useEffect(() => {
    const found = allProducts?.find(p => p._id === productId)
    if (found) { setProduct(found); setLoading(false); return }
    setLoading(true)
    productApi.getById(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productId])

  const related = useMemo(() =>
    (!product || !allProducts?.length)
      ? []
      : allProducts.filter(p => p._id !== product._id && p.category === product.category).slice(0, 4),
    [product, allProducts]
  )

  const inStock = (product?.stock ?? 0) > 0
  const price = product ? (product.salePrice || product.price) : 0
  const off = product?.salePrice ? discountPct(product.price, product.salePrice) : 0

  const fire = (msg: string) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }

  const handleCart = () => {
    if (!product || !inStock) return
    onAdd(product, qty)
    fire(`${qty}× ${product.name} added to cart`)
  }

  const handleBuy = () => {
    if (!product || !inStock) return
    onAdd(product, qty)
    if (setShowCart) setShowCart(true)
  }

  const handleWhatsApp = () => {
    if (!product || !inStock) return
    const url = buildWhatsAppLink(product, qty, settings?.whatsappNumber)
    if (!url) { alert('WhatsApp number not configured. Please contact support.'); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      navigator.share({ title: product?.name, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => fire('Link copied!'))
    }
  }

  // ── Loading ──
  if (loading) return (
    <div className="pdp-state">
      <Loader2 size={24} className="pdp-spin" />
      <span>Loading</span>
    </div>
  )

  // ── Not found ──
  if (!product) return (
    <div className="pdp-state pdp-state--err">
      <div style={{ fontSize: 40 }}>🔍</div>
      <h2>Product not found</h2>
      <p>This product may no longer be available.</p>
      <Link href="/store" className="pdp-state-cta">← Back to store</Link>
    </div>
  )

  return (
    <main>
      <Toast msg={toast.msg} show={toast.show} />


<section className="wrap pd">
  <nav className="crumbs pd-crumbs" aria-label="Breadcrumb">
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab?.('home'); }}>Home</a>
    <span className="sep">/</span>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab?.('shop'); }}>{product.category}</a>
    <span className="sep">/</span>
    {product.name}
  </nav>

  <div className="pd-grid">
    <Gallery product={product} />

    <div className="pd-info">
      <div className="pd-cat eyebrow is-live">{product.category}</div>
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-rate">
        <Stars rating={4.9} />
        <span className="sep"></span><span>2,481 reviews</span>
        {product.sku && <><span className="sep"></span><span>SKU {product.sku}</span></>}
      </div>

      <div className="pd-price">
        <span className="now">{money(price)}</span>
        {product.salePrice && <><span className="was">{money(product.price)}</span><span className="off">SAVE {off}%</span></>}
      </div>
      <div className="pd-tax">Incl. of all taxes · No-cost EMI from ₹4,166/mo</div>

      <p className="pd-desc">{product.description || ""}</p>

      <div className="pd-block">
        <div className="lbl">Quantity 
          {inStock ? (
            <span className="avail"><span className="live"></span>In stock · ships today</span>
          ) : (
            <span className="avail" style={{ color: 'var(--red)' }}>Out of stock</span>
          )}
        </div>
        <div className="pd-buy">
          <div className="qty">
            <button aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!inStock}><svg style={{width: "16px", height: "16px"}}><use href="#i-minus"/></svg></button>
            <span className="v">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty(q => q + 1)} disabled={!inStock}><svg style={{width: "16px", height: "16px"}}><use href="#i-plus"/></svg></button>
          </div>
          <button className="btn btn-dark btn-lg" onClick={handleCart} disabled={!inStock}>Add to cart</button>
          
          {(settings as any)?.manualUpiEnabled ? (
            <button className="btn btn-accent btn-lg" onClick={handleBuy} disabled={!inStock}>Buy now</button>
          ) : settings?.whatsappEnabled ? (
            <button className="btn btn-accent btn-lg" style={{background: '#25D366'}} onClick={handleWhatsApp} disabled={!inStock}>
              Order via WhatsApp
            </button>
          ) : (
            <button className="btn btn-accent btn-lg" onClick={handleBuy} disabled={!inStock}>Buy now</button>
          )}
        </div>
        <div className="pd-actions-2">
          <button className="btn" onClick={() => setLiked(!liked)}>
            <svg className="btn-ico" style={{width: "17px", height: "17px", fill: liked ? 'currentColor' : 'none'}}><use href="#i-heart"/></svg>
            {liked ? 'Added to wishlist' : 'Add to wishlist'}
          </button>
        </div>
      </div>

      <div className="trust">
        <div className="t"><span className="ti"><svg><use href="#i-truck"/></svg></span><div><h5>Free 2-day delivery</h5><p>Order before 4pm, ships today</p></div></div>
        <div className="t"><span className="ti"><svg><use href="#i-shield"/></svg></span><div><h5>Secure payments</h5><p>UPI, cards & no-cost EMI</p></div></div>
      </div>
    </div>
  </div>

  <Story product={product} />

  <section style={{marginTop: '3rem'}}>
    <Tabs product={product} />
  </section>

  {related.length > 0 && (
    <section className="section-tight pd-story-actions" style={{marginTop: '4rem'}}>
      <div className="sec-head">
        <div className="titles"><div className="eyebrow">Pairs well with</div><h2 className="h2">You may also like.</h2></div>
      </div>
      <div className="shelf">
        {related.map(p => (
          <RelatedCard 
            key={p._id} 
            product={p} 
            onAdd={onAdd} 
            onClick={() => { setActiveTab?.('product', p); window.scrollTo(0, 0); }} 
          />
        ))}
      </div>
    </section>
  )}
</section>


    </main>
  )
}
