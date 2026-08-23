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

function buildWhatsAppLink(product: ApiProduct, qty: number): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
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
function RelatedCard({ product, onAdd }: { product: ApiProduct; onAdd: (p: ApiProduct) => void }) {
  const [liked, setLiked] = useState(false)
  const img = product.images?.[0]?.url || '/products/lyrix-watch.png'
  const price = product.salePrice || product.price
  const off = product.salePrice ? discountPct(product.price, product.salePrice) : 0

  return (
    <Link href={`/product/${product._id}`} className="pdp-rc">
      <div className="pdp-rc-img-wrap">
        {off > 0 && <span className="pdp-rc-off">-{off}%</span>}
        <button
          className={`pdp-rc-heart ${liked ? 'pdp-rc-heart--on' : ''}`}
          onClick={e => { e.preventDefault(); setLiked(v => !v) }}
        >
          <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <img src={img} alt={product.name} className="pdp-rc-img" />
      </div>
      <div className="pdp-rc-body">
        <div className="pdp-rc-cat">{product.category}</div>
        <div className="pdp-rc-name">{product.name}</div>
        <div className="pdp-rc-price">
          <strong>{money(price)}</strong>
          {product.salePrice && <s>{money(product.price)}</s>}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetail({
  productId,
  onAdd,
  count,
  allProducts,
}: {
  productId: string
  onAdd: (p: ApiProduct) => void
  count: number
  allProducts: ApiProduct[]
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
    for (let i = 0; i < qty; i++) onAdd(product)
    fire(`${qty}× ${product.name} added to cart`)
  }

  const handleBuy = () => {
    if (!product || !inStock) return
    const url = buildWhatsAppLink(product, qty)
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
    <div className="pdp">
      <Toast msg={toast.msg} show={toast.show} />

      {/* ── Breadcrumb ── */}
      <nav className="pdp-bc" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/store">Store</Link>
        <span aria-hidden>/</span>
        <Link href={`/store?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      {/* ── Hero ── */}
      <section className="pdp-hero">
        {/* Left — Gallery */}
        <div className="pdp-hero-left">
          <Gallery product={product} />
        </div>

        {/* Right — Info */}
        <div className="pdp-hero-right">
          <div className="pdp-category">{product.category}</div>
          <h1 className="pdp-title">{product.name}</h1>
          <Stars rating={4.5} />

          {/* Price */}
          <div className="pdp-price-row">
            <span className="pdp-price">{money(price)}</span>
            {product.salePrice && (
              <>
                <span className="pdp-mrp">{money(product.price)}</span>
                <span className="pdp-badge-off">{off}% off</span>
              </>
            )}
          </div>
          {product.salePrice && (
            <div className="pdp-savings">You save {money(product.price - product.salePrice)}</div>
          )}

          {/* Short description */}
          {product.description && (
            <p className="pdp-short">
              {product.description.length > 160
                ? product.description.slice(0, 157) + '…'
                : product.description}
            </p>
          )}

          {/* Stock */}
          <div className={`pdp-stock ${inStock ? 'pdp-stock--in' : 'pdp-stock--out'}`}>
            <span className="pdp-stock-dot" />
            {inStock
              ? `In stock${product.stock <= 10 ? ` · Only ${product.stock} left` : ''}`
              : 'Out of stock'}
          </div>

          {/* Variants */}
          {product.variants?.map(v => (
            <div key={v.name} className="pdp-variant-group">
              <div className="pdp-variant-label">{v.name}</div>
              <div className="pdp-variant-chips">
                {v.options.map(o => <button key={o} className="pdp-chip">{o}</button>)}
              </div>
            </div>
          ))}

          {/* Quantity */}
          {inStock && (
            <div className="pdp-qty-row">
              <span className="pdp-qty-label">Quantity</span>
              <div className="pdp-qty-ctrl">
                <button className="pdp-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}><Minus size={12} /></button>
                <span className="pdp-qty-val">{qty}</span>
                <button className="pdp-qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}><Plus size={12} /></button>
              </div>
              {product.stock <= 5 && <span className="pdp-qty-warn">Only {product.stock} left</span>}
            </div>
          )}

          {/* Primary CTA */}
          <div className="pdp-cta">
            <button className={`pdp-btn-add ${!inStock ? 'pdp-btn--off' : ''}`} onClick={handleCart} disabled={!inStock}>
              <ShoppingBag size={15} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className={`pdp-btn-buy ${!inStock ? 'pdp-btn--off' : ''}`} onClick={handleBuy} disabled={!inStock}>
              <MessageCircle size={15} />
              Buy Now
            </button>
          </div>

          {/* Secondary actions */}
          <div className="pdp-secondary">
            <button className={`pdp-wish ${liked ? 'pdp-wish--on' : ''}`} onClick={() => setLiked(v => !v)}>
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {liked ? 'Saved' : 'Add to Wishlist'}
            </button>
            <span className="pdp-secondary-sep" aria-hidden />
            <button className="pdp-share" onClick={handleShare}>
              <Share2 size={13} />
              Share
            </button>
          </div>

          {/* Benefits */}
          <div className="pdp-benefits">
            <div className="pdp-benefit"><Truck size={13} /><span>Free delivery over ₹2,000</span></div>
            <div className="pdp-benefit-sep" aria-hidden />
            <div className="pdp-benefit"><RotateCcw size={13} /><span>7-day returns</span></div>
            <div className="pdp-benefit-sep" aria-hidden />
            <div className="pdp-benefit"><Package size={13} /><span>Secure packaging</span></div>
          </div>

          {product.sku && <div className="pdp-sku">SKU: {product.sku}</div>}
        </div>
      </section>

      {/* ── Tabs ── */}
      <Tabs product={product} />

      {/* ── Story ── */}
      <Story product={product} />

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="pdp-related">
          <div className="pdp-related-head">
            <h2 className="pdp-related-h">You may also like</h2>
            <Link href={`/store?category=${encodeURIComponent(product.category)}`} className="pdp-related-all">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="pdp-related-grid">
            {related.map(p => <RelatedCard key={p._id} product={p} onAdd={onAdd} />)}
          </div>
        </section>
      )}

      {/* ── Mobile sticky bar ── */}
      <div className="pdp-bar">
        <div className="pdp-bar-price">{money(price)}</div>
        <div className="pdp-bar-btns">
          <button className={`pdp-bar-add ${!inStock ? 'pdp-btn--off' : ''}`} onClick={handleCart} disabled={!inStock}>
            <ShoppingBag size={13} />Cart
          </button>
          <button className={`pdp-bar-buy ${!inStock ? 'pdp-btn--off' : ''}`} onClick={handleBuy} disabled={!inStock}>
            <MessageCircle size={13} />Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
