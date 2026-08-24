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
function RelatedCard({ product, onAdd }: { product: ApiProduct; onAdd: (p: ApiProduct, qty: number) => void }) {
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
}: {
  productId: string
  onAdd: (p: ApiProduct, qty: number) => void
  count: number
  allProducts: ApiProduct[]
  settings?: { whatsappEnabled?: boolean; whatsappNumber?: string; onlinePaymentEnabled?: boolean }
  setShowCart?: (b: boolean) => void
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
    
    // If WhatsApp is explicitly disabled, default to cart
    if (settings && settings.whatsappEnabled === false) {
      onAdd(product, qty)
      if (setShowCart) setShowCart(true)
      return
    }
    
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
  <nav className="crumbs pd-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span className="sep">/</span><a href="shop.html">Audio</a><span className="sep">/</span>Headphones<span className="sep">/</span>Pro 2</nav>

  <div className="pd-grid">
    
        <div className="gallery">
      {product.images?.map((img, i) => (
        <input key={i} className="gal-radio" type="radio" name="gal" id={`gv${i+1}`} defaultChecked={i === 0} aria-label={`View ${i+1}`} />
      ))}
      <div className="pd-galwrap">
        <div className="thumbs">
          {product.images?.map((img, i) => (
            <label key={i} className="thumb" htmlFor={`gv${i+1}`}><img src={img.url} alt={`${product.name} view ${i+1}`} /></label>
          ))}
        </div>
        <div className="stage-img">
          <span className="badge badge-dark">Best seller</span>
          {product.images?.map((img, i) => (
            <img key={i} className={`gimg g${i+1}`} src={img.url} alt={`${product.name} view ${i+1}`} />
          ))}
          <span className="gallery-callout"><span className="node"></span>Onyx · aluminium frame</span>
          <span className="zoom-note"><svg><use href="#i-zoom"/></svg>Hover to zoom</span>
        </div>
      </div>
    </div>

    
    <div className="pd-info">
      <div className="pd-cat eyebrow is-live">{product.category}</div>
      <h1 className="pd-title">{product.name}</h1>

      <div className="pd-rate">
        <span className="stars"><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg></span>
        <span>4.9</span><span className="sep"></span><span>2,481 reviews</span><span className="sep"></span><span>SKU EC-PRO2-ONX</span>
      </div>

      <div className="pd-price">
        <span className="now">{money(price)}</span>{product.salePrice && <><span className="was">{money(product.price)}</span><span className="off">SAVE {off}%</span></>}
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
          <button className="btn btn-accent btn-lg" onClick={handleBuy} disabled={!inStock}>Buy now</button>
        </div>
        <div className="pd-actions-2">
          <button className="btn"><svg className="btn-ico" style={{width: "17px", height: "17px"}}><use href="#i-heart"/></svg>Add to wishlist</button>
        </div>
      </div>

      
      <div className="trust">
        <div className="t"><span className="ti"><svg><use href="#i-truck"/></svg></span><div><h5>Free 2-day delivery</h5><p>Order before 4pm, ships today</p></div></div>
        <div className="t"><span className="ti"><svg><use href="#i-shield"/></svg></span><div><h5>Secure payments</h5><p>UPI, cards & no-cost EMI</p></div></div>
        <div className="t"><span className="ti"><svg><use href="#i-refresh"/></svg></span><div><h5>30-day returns</h5><p>No questions asked</p></div></div>
        <div className="t"><span className="ti"><svg><use href="#i-headset"/></svg></span><div><h5>2-year warranty</h5><p>Real human support</p></div></div>
      </div>
    </div>
  </div>

  
  <section className="pd-story">
    <div className="story-hero on-stage">
      <div className="glow"></div>
      <div className="eyebrow on-dark is-live">Engineered for immersion</div>
      <h2 className="h2 balance">Every detail designed to disappear behind the experience.</h2>
      <img src="assets/pro2-01.svg" alt="{product.name} on a dark stage" />
    </div>

    <div className="split story-split section-tight">
      <div className="split-media"><span className="badge tab">Acoustics / 01</span><img src="assets/pro2-04.svg" alt="40mm driver detail" /></div>
      <div className="split-copy">
        <div className="eyebrow">The driver</div>
        <h2 className="h3">40mm of engineered silence.</h2>
        <p className="lead">A custom bio-cellulose driver moves more air with less distortion — so the quiet parts stay quiet and the loud parts never harden.</p>
        <div className="story-metrics">
          <div className="story-metric"><div className="n">40<span className="u">mm</span></div><div className="l">Bio-cellulose driver</div></div>
          <div className="story-metric"><div className="n">−48<span className="u">dB</span></div><div className="l">Adaptive ANC depth</div></div>
          <div className="story-metric"><div className="n">20<span className="u">kHz</span></div><div className="l">Frequency ceiling</div></div>
        </div>
      </div>
    </div>

    <div className="split reverse story-split section-tight">
      <div className="split-media"><span className="badge tab">Comfort / 02</span><img src="assets/pro2-03.svg" alt="Folded Pro 2" /></div>
      <div className="split-copy">
        <div className="eyebrow">All-day comfort</div>
        <h2 className="h3">320 grams you forget you're wearing.</h2>
        <p className="lead">Memory-foam cushions wrapped in protein leather, balanced on an aluminium yoke that spreads weight evenly and folds flat for travel.</p>
        <ul className="feat-list">
          <li><span className="k"><svg><use href="#i-bolt"/></svg></span><span><b>5-min charge → 4 hours</b> of playback over USB-C.</span></li>
          <li><span className="k"><svg><use href="#i-wave"/></svg></span><span><b>Head-tracked spatial audio</b> that follows the room, not you.</span></li>
          <li><span className="k"><svg><use href="#i-chip"/></svg></span><span><b>Multipoint pairing</b> across two devices at once.</span></li>
        </ul>
      </div>
    </div>
  </section>

  
  {/*  PRODUCT DETAILS ACCORDIONS  */}
  <section className="product-accordions" style={{ marginTop: '3rem', padding: '0 16px' }}>
    <Accordion title="Product Details" defaultOpen={true}>
      <p style={{ marginBottom: '1rem' }}>{product.description || ""}</p>
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <li><strong>Driver:</strong> 40mm bio-cellulose</li>
        <li><strong>Battery:</strong> 40hr (ANC on)</li>
        <li><strong>Connectivity:</strong> Bluetooth 5.4 LE</li>
        <li><strong>Weight:</strong> 320g</li>
      </ul>
    </Accordion>
    
    <Accordion title="Shipping & Delivery">
      <p style={{ marginBottom: '1rem' }}>We offer fast, reliable shipping across all major pin codes in India.</p>
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <li><strong>Free Standard Delivery:</strong> On all orders above ₹2,499.</li>
        <li><strong>Express Delivery:</strong> Delivered within 2 business days.</li>
        <li><strong>Dispatch Time:</strong> Orders placed before 4 PM ship the same day.</li>
      </ul>
    </Accordion>
    
    <Accordion title="Returns & Refunds">
      <p style={{ marginBottom: '1rem' }}>Your satisfaction is our priority. Our guarantee includes:</p>
      <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <li><strong>7-Day Returns:</strong> No questions asked return policy for all sealed items.</li>
        <li><strong>Instant Refunds:</strong> Processed within 24 hours of receiving the returned item.</li>
        <li><strong>2-Year Warranty:</strong> Full replacement warranty on manufacturing defects.</li>
      </ul>
    </Accordion>
  </section>
  
  <section className="pullquote">
    <span className="stars"><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg></span>
    <blockquote>“The first pair I've owned that I genuinely forget I'm wearing.”</blockquote>
    <div className="by">Aditya R. · Verified owner</div>
  </section>

  
  <section className="section-tight pd-story-actions">
    <div className="sec-head"><div className="titles"><div className="eyebrow">Pairs well with</div><h2 className="h2">You may also like.</h2></div>
      <a href="shop.html" className="linkline">All audio <svg className="btn-ico"><use href="#i-arrow"/></svg></a></div>
    <div className="shelf">
      <a href="product.html" className="card">
        <div className="card-media"><div className="card-badges"><span className="badge badge-accent">New</span></div>
          <button className="wish card-wish" aria-label="Wishlist"><svg><use href="#i-heart"/></svg></button>
          <img className="main" src="assets/buds-air-01.svg" alt="Buds Air 3" /><img className="alt" src="assets/buds-air-02.svg" alt="" />
          <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
        <div className="card-body"><div className="card-cat">Earbuds</div><div className="card-name">Buds Air 3</div>
          <p className="card-desc">Spatial audio · wireless case</p>
          <div className="card-foot"><span className="price">₹9,499</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.8</span></div></div>
      </a>
      <a href="product.html" className="card">
        <div className="card-media">
          <button className="wish card-wish" aria-label="Wishlist"><svg><use href="#i-heart"/></svg></button>
          <img className="solo" src="assets/field-speaker-01.svg" alt="Field Speaker" />
          <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
        <div className="card-body"><div className="card-cat">Speaker</div><div className="card-name">Field Speaker</div>
          <p className="card-desc">360° sound · IP67 · 24h</p>
          <div className="card-foot"><span className="price">₹12,999</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.9</span></div></div>
      </a>
      <a href="product.html" className="card">
        <div className="card-media"><div className="card-badges"><span className="badge">Charging</span></div>
          <button className="wish card-wish" aria-label="Wishlist"><svg><use href="#i-heart"/></svg></button>
          <img className="solo" src="assets/gan-100w.svg" alt="GaN 100W" />
          <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
        <div className="card-body"><div className="card-cat">Charger</div><div className="card-name">GaN 100W</div>
          <p className="card-desc">Dual USB-C · foldable pins</p>
          <div className="card-foot"><span className="price">₹3,999</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.9</span></div></div>
      </a>
      <a href="product.html" className="card">
        <div className="card-media"><div className="card-badges"><span className="badge">Audio</span></div>
          <button className="wish card-wish" aria-label="Wishlist"><svg><use href="#i-heart"/></svg></button>
          <img className="solo" src="assets/headset-rx.svg" alt="Headset RX" />
          <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
        <div className="card-body"><div className="card-cat">Gaming headset</div><div className="card-name">Headset RX</div>
          <p className="card-desc">Detachable boom mic · spatial</p>
          <div className="card-foot"><span className="price">₹8,999</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.7</span></div></div>
      </a>
    </div>
  </section>
</section>


    </main>
  )
}
