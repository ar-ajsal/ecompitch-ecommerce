'use client'

import React, { useState, useEffect } from 'react'


const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="accordion-item" style={{ borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', fontSize: '16px', fontWeight: '600' }}
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

const Icons = () => (
  <div style={{ display: 'none' }}>
    <svg width="0" height="0" style={{position: "absolute"}} aria-hidden="true">
  <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></symbol>
  <symbol id="i-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h2l2.2 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="i-ne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.6-7-9.7A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.3C19 15.4 12 20 12 20Z"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.5l1.1-6L3.4 9.3l6-.8Z"/></symbol>
  <symbol id="i-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a8 8 0 0 1 14-4.5L20 8"/><path d="M20 4v4h-4"/><path d="M20 13a8 8 0 0 1-14 4.5L4 16"/><path d="M4 20v-4h4"/></symbol>
  <symbol id="i-headset" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13v-1a7 7 0 0 1 14 0v1"/><rect x="3.5" y="13" width="3.5" height="6" rx="1.4"/><rect x="17" y="13" width="3.5" height="6" rx="1.4"/><path d="M19 19a3 3 0 0 1-3 3h-2"/></symbol>
  <symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3 5 13h5l-1 8 8-10h-5Z"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M5 12h14"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10"/></symbol>
  <symbol id="i-zoom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="m20 20-4-4M10.5 8v5M8 10.5h5"/></symbol>
  <symbol id="i-wave" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 12h2M9 7v10M14 4v16M19 9v6"/></symbol>
  <symbol id="i-chip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/></symbol>
  <symbol id="i-ear" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 18c-2-1-3-3-3-6a8 8 0 1 1 12 6.9c-2 1.1-2 2-2 3.1"/><circle cx="11" cy="10" r="2.4"/></symbol>
</svg>
  </div>
)

const Header = ({ activeTab, setActiveTab, cart, setShowCart }: any) => (
  <>
    <div className="ticker">
  <span className="item"><b>Free 2-day delivery</b> on orders over ₹2,499</span>
  <span className="sep">/</span>
  <span className="item">6-month no-cost EMI</span>
  <span className="sep">/</span>
  <span className="item">2-year ecompitch warranty</span>
</div>
    <header className="nav">
      <div className="wrap nav-in">
        <button className="nav-burger icon-btn" aria-label="Open menu">
          <svg><use href="#i-menu"/></svg>
        </button>
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} aria-label="ecompitch home">
          ecompitch<span className="spark"></span>
        </a>
        <nav className="nav-menu" aria-label="Primary">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>Categories</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>New Arrivals</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>About</a>
        </nav>
        <div className="nav-tools">
          <button className="nav-search" aria-label="Search products">
            <svg><use href="#i-search"/></svg><span className="ph">Search ecompitch</span><kbd>/</kbd>
          </button>
          <button className="icon-btn" aria-label="Account"><svg><use href="#i-user"/></svg></button>
          <a className="icon-btn cart-link" href="#" onClick={(e) => { e.preventDefault(); setShowCart(true); }} aria-label="Cart">
            <svg><use href="#i-cart"/></svg>
            <span className="cart-count">{cart.reduce((total: number, item: any) => total + item.quantity, 0)}</span>
          </a>
        </div>
      </div>
    </header>
  </>
)

const Footer = () => (
  <footer className="foot">
  <div className="wrap foot-top">
    <div className="foot-brand">
      <div className="brand">ecompitch<span className="spark"></span></div>
      <p>Everyday tech, elevated. Premium audio, power and wearables — designed properly, priced honestly.</p>
    </div>
    <div className="foot-col"><h5>Shop</h5><a href="shop.html">Audio</a><a href="shop.html">Wearables</a><a href="shop.html">Charging</a><a href="shop.html">Gaming</a><a href="shop.html">Computing</a></div>
    <div className="foot-col"><h5>Company</h5><a href="#">About</a><a href="#">Sustainability</a><a href="#">Press</a><a href="#">Careers</a></div>
    <div className="foot-col"><h5>Support</h5><a href="#">Track order</a><a href="#">Returns</a><a href="#">Warranty</a><a href="#">Contact</a></div>
  </div>
  <div className="wrap foot-bar">
    <span>© 2026 ecompitch Technologies</span>
    <div className="foot-pay"><span>UPI</span><span>VISA</span><span>MASTERCARD</span><span>EMI</span></div>
  </div>
</footer>
)

const Homepage = ({ setActiveTab }: any) => (
  <main style={{ paddingBottom: "80px" }}>
    
{/*  ============ HERO ============  */}
<section className="hero">
  <div className="wrap hero-grid">
    <div className="hero-copy">
      <div className="hero-kicker eyebrow is-live">Autumn 2026 · Flagship Release</div>
      <h1 className="hero-title display balance">The future of <span className="accentword">everyday</span> tech.</h1>
      <p className="hero-sub lead">Audio, power and wearables engineered for people who expect more from the objects they carry every day.</p>
      <div className="hero-actions">
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="btn btn-dark btn-lg">Explore collection <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="btn btn-lg">Meet Pro&nbsp;2</a>
      </div>
      <div className="hero-metrics">
        <div className="metric"><div className="n">40h</div><div className="l">Playback</div></div>
        <div className="metric"><div className="n">4.9★</div><div className="l">12k reviews</div></div>
        <div className="metric"><div className="n">120+</div><div className="l">Products</div></div>
      </div>
    </div>
    <div className="hero-stage">
      <div className="hero-halo"></div>
      <div className="hero-plate">
        <span className="callout tl"><span className="node"></span><span className="rule"></span>Adaptive ANC</span>
        <span className="callout br">Aluminium yoke<span className="rule"></span><span className="node"></span></span>
        <img src="assets/headphones-hero.svg" alt="ecompitch Pro 2 over-ear headphones, three-quarter view" />
        <div className="hero-tag">
          <span className="chip"><span></span></span>
          <div><div className="t1">ecompitch Pro&nbsp;2</div><div className="t2">₹24,999 · IN STOCK</div></div>
        </div>
      </div>
    </div>
  </div>
  {/*  marquee spec strip  */}
  <div className="wrap-wide wrap">
    <div className="marquee-strip">
      <div className="cell"><svg><use href="#i-wave"/></svg>Spatial audio</div>
      <div className="cell"><svg><use href="#i-bolt"/></svg>USB-C fast charge</div>
      <div className="cell"><svg><use href="#i-chip"/></svg>ecompitch H1 silicon</div>
      <div className="cell"><svg><use href="#i-shield"/></svg>IP54 rated</div>
    </div>
  </div>
</section>

{/*  ============ FLAGSHIP STORY ============  */}
<section className="section wrap">
  <div className="split">
    <div className="split-media">
      <span className="badge tab">Precision / 01</span>
      <img src="assets/headphones-onyx.svg" alt="ecompitch Pro 2 headphones, front view" />
    </div>
    <div className="split-copy">
      <div className="eyebrow">The flagship</div>
      <h2 className="h2 balance">Engineered for everyday life.</h2>
      <p className="lead">A cleaner way to experience sound, power and performance — with the details tuned so precisely they disappear behind the moment.</p>
      <ul className="feat-list">
        <li><span className="k"><svg><use href="#i-wave"/></svg></span><span><b>Adaptive noise cancellation</b> reads your surroundings 200× a second.</span></li>
        <li><span className="k"><svg><use href="#i-bolt"/></svg></span><span><b>Five-minute charge</b> for four hours of uninterrupted playback.</span></li>
        <li><span className="k"><svg><use href="#i-chip"/></svg></span><span><b>ecompitch H1 silicon</b> for lossless, low-latency spatial sound.</span></li>
      </ul>
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="linkline">Explore Pro&nbsp;2 <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</section>

{/*  ============ CATEGORY MOSAIC ============  */}
<section className="section-tight wrap">
  <div className="sec-head">
    <div className="titles">
      <div className="eyebrow">Shop by world</div>
      <h2 className="h2">Six categories, one standard.</h2>
    </div>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="linkline">All products <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
  </div>
  <div className="mosaic">
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="cat feature">
      <div className="cat-bg"><img src="assets/headphones-onyx-b.svg" alt="" /></div><div className="cat-veil"></div>
      <span className="badge badge-accent">Best in class</span>
      <span className="idx">A / 01</span><span className="cat-count">28 items</span>
      <h3>Audio</h3>
      <span className="go">Headphones, earbuds & speakers <svg><use href="#i-ne"/></svg></span>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="cat">
      <div className="cat-bg"><img src="assets/watch-s2-01.svg" alt="" /></div><div className="cat-veil"></div>
      <span className="idx">A / 02</span>
      <h3>Wearables</h3><span className="go">Watches <svg><use href="#i-ne"/></svg></span>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="cat">
      <div className="cat-bg"><img src="assets/gan-100w.svg" alt="" /></div><div className="cat-veil"></div>
      <span className="idx">A / 03</span>
      <h3>Charging</h3><span className="go">Chargers & banks <svg><use href="#i-ne"/></svg></span>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="cat wide">
      <div className="cat-bg"><img src="assets/pad-pro.svg" alt="" /></div><div className="cat-veil"></div>
      <span className="idx">A / 04</span>
      <h3>Gaming</h3><span className="go">Controllers & headsets <svg><use href="#i-ne"/></svg></span>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="cat">
      <div className="cat-bg"><img src="assets/keys-75.svg" alt="" /></div><div className="cat-veil"></div>
      <span className="idx">A / 05</span>
      <h3>Computing</h3><span className="go">Keys & mice <svg><use href="#i-ne"/></svg></span>
    </a>
  </div>
</section>

{/*  ============ FEATURED COLLECTION ============  */}
<section className="section-tight wrap">
  <div className="sec-head">
    <div className="titles"><div className="eyebrow is-live">Featured collection</div><h2 className="h2">Worth owning.</h2></div>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="linkline">View all <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
  </div>
  <div className="shelf">
    {/*  card 1  */}
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media">
        <div className="card-badges"><span className="badge badge-dark">Best seller</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="main" src="assets/headphones-onyx.svg" alt="ecompitch Pro 2" />
        <img className="alt" src="assets/headphones-onyx-b.svg" alt="" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
      </div>
      <div className="card-body">
        <div className="card-cat">Headphones</div>
        <div className="card-name">ecompitch Pro 2</div>
        <p className="card-desc">Adaptive ANC · 40-hour battery</p>
        <div className="card-foot"><span className="price">₹24,999</span><span className="price-was">₹29,999</span>
          <span className="card-rate"><svg><use href="#i-star"/></svg>4.9</span></div>
      </div>
    </a>
    {/*  card 2  */}
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media">
        <div className="card-badges"><span className="badge badge-accent">New</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="main" src="assets/buds-air-01.svg" alt="Buds Air 3" />
        <img className="alt" src="assets/buds-air-02.svg" alt="" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
      </div>
      <div className="card-body">
        <div className="card-cat">Earbuds</div>
        <div className="card-name">Buds Air 3</div>
        <p className="card-desc">Spatial audio · wireless case</p>
        <div className="card-foot"><span className="price">₹9,499</span>
          <span className="card-rate"><svg><use href="#i-star"/></svg>4.8</span></div>
      </div>
    </a>
    {/*  card 3  */}
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media">
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/watch-s2-01.svg" alt="Watch S2" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
      </div>
      <div className="card-body">
        <div className="card-cat">Smart watch</div>
        <div className="card-name">ecompitch Watch S2</div>
        <p className="card-desc">AMOLED · 7-day battery</p>
        <div className="card-foot"><span className="price">₹18,999</span><span className="price-was">₹21,999</span>
          <span className="card-rate"><svg><use href="#i-star"/></svg>4.7</span></div>
      </div>
    </a>
    {/*  card 4  */}
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media">
        <div className="card-badges"><span className="badge badge-dark">Best seller</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/field-speaker-01.svg" alt="Field Speaker" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
      </div>
      <div className="card-body">
        <div className="card-cat">Speaker</div>
        <div className="card-name">Field Speaker</div>
        <p className="card-desc">360° sound · IP67 · 24h</p>
        <div className="card-foot"><span className="price">₹12,999</span>
          <span className="card-rate"><svg><use href="#i-star"/></svg>4.9</span></div>
      </div>
    </a>
  </div>
</section>

{/*  ============ BRAND STATEMENT ============  */}
<section className="section">
  <div className="wrap statement">
    <p className="big">Good technology should feel <em>effortless.</em></p>
    <p>We design fewer things, and we design them properly — so the gear you reach for every day gets out of your way and lets the moment lead.</p>
  </div>
</section>

{/*  ============ IMMERSIVE DARK ============  */}
<section className="stage on-stage immersive">
  <div className="wrap immersive-grid">
    <div className="immersive-copy">
      <div className="eyebrow on-dark is-live">ecompitch Pro 2</div>
      <h2 className="display"><span className="accentword">Pure</span> sound.</h2>
      <p className="lead">Immersive audio engineered for every moment — from the morning commute to the last track before midnight.</p>
      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="btn btn-accent btn-lg">Discover Pro 2 <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
      <div className="spec-inline">
        <div><div className="n">40<span className="u">hr</span></div><div className="l">Battery</div></div>
        <div><div className="n">−48<span className="u">dB</span></div><div className="l">Noise cancelled</div></div>
        <div><div className="n">0.1<span className="u">ms</span></div><div className="l">Latency</div></div>
      </div>
    </div>
    <div className="immersive-stage">
      <div className="glow"></div>
      <img src="assets/headphones-onyx-b.svg" alt="ecompitch Pro 2 headphones on a dark stage" />
    </div>
  </div>
</section>

{/*  ============ NEW ARRIVALS ============  */}
<section className="section-tight wrap">
  <div className="sec-head">
    <div className="titles"><div className="eyebrow">Just landed</div><h2 className="h2">New arrivals.</h2></div>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="linkline">See what's new <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
  </div>
  <div className="shelf">
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media"><div className="card-badges"><span className="badge badge-accent">New</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/power-bank-20k.svg" alt="Power bank 20k" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
      <div className="card-body"><div className="card-cat">Power bank</div><div className="card-name">Cell 20K GaN</div>
        <p className="card-desc">140W · fast-charges a laptop</p>
        <div className="card-foot"><span className="price">₹6,499</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.8</span></div></div>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media"><div className="card-badges"><span className="badge">Limited</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/pad-pro.svg" alt="Pad Pro controller" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
      <div className="card-body"><div className="card-cat">Gaming</div><div className="card-name">Pad Pro</div>
        <p className="card-desc">Hall-effect sticks · low latency</p>
        <div className="card-foot"><span className="price">₹7,999</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.9</span></div></div>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media"><div className="card-badges"><span className="badge badge-accent">New</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/keys-75.svg" alt="Keys 75 keyboard" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
      <div className="card-body"><div className="card-cat">Computing</div><div className="card-name">Keys 75</div>
        <p className="card-desc">Low-profile · hot-swap switches</p>
        <div className="card-foot"><span className="price">₹11,499</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.7</span></div></div>
    </a>
    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }} className="card">
      <div className="card-media"><div className="card-badges"><span className="badge">Audio</span></div>
        <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
        <img className="solo" src="assets/cord-one.svg" alt="Cord One wired earphones" />
        <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div></div>
      <div className="card-body"><div className="card-cat">Wired earphones</div><div className="card-name">Cord One</div>
        <p className="card-desc">USB-C · studio-tuned DAC</p>
        <div className="card-foot"><span className="price">₹2,499</span><span className="card-rate"><svg><use href="#i-star"/></svg>4.6</span></div></div>
    </a>
  </div>
</section>

{/*  ============ BENEFITS ============  */}
<section className="section-tight wrap">
  <div className="benefits">
    <div className="benefit"><span className="bi"><svg><use href="#i-truck"/></svg></span><div><h4>Fast delivery</h4><p>Free 2-day shipping across India on orders over ₹2,499.</p></div></div>
    <div className="benefit"><span className="bi"><svg><use href="#i-shield"/></svg></span><div><h4>Secure checkout</h4><p>256-bit encryption with UPI, cards and no-cost EMI.</p></div></div>
    <div className="benefit"><span className="bi"><svg><use href="#i-refresh"/></svg></span><div><h4>Easy returns</h4><p>30-day returns, no questions asked. Keep the box.</p></div></div>
    <div className="benefit"><span className="bi"><svg><use href="#i-headset"/></svg></span><div><h4>Real support</h4><p>Talk to people, not scripts — 7 days a week.</p></div></div>
  </div>
</section>

{/*  ============ CTA BAND ============  */}
<section className="section-tight wrap">
  <div className="band">
    <div className="spark-field"></div>
    <div className="band-in">
      <div>
        <div className="eyebrow on-dark is-live">The ecompitch list</div>
        <h2 className="h2" style={{marginTop: "1rem"}}>First access, no noise.</h2>
        <p className="lead">Drops, restocks and members-only pricing — a couple of emails a month, never more.</p>
      </div>
      <div className="subscribe">
        <input type="email" placeholder="you@example.com" aria-label="Email address" />
        <button type="button" className="btn btn-accent">Join <svg className="btn-ico"><use href="#i-arrow"/></svg></button>
      </div>
    </div>
  </div>
</section>

  </main>
)

const ShopPage = ({ setActiveTab, products, addToCart }: any) => (
  <main>
    {/* PAGE HEAD */}
    <section className="wrap page-head">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a>
        <span className="sep">/</span>Shop
      </nav>
      <h1 className="display balance">Everything worth owning.</h1>
      <p className="lead">Every product on this page earned its place — tested against the one standard that matters: would we carry it every day?</p>
    </section>

    {/* CATEGORY PILLS */}
    <section className="wrap">
      <div className="cat-scroller">
        <button className="pill is-active"><span className="dot"></span>All</button>
        <button className="pill">Audio</button>
        <button className="pill">Wearables</button>
        <button className="pill">Charging</button>
        <button className="pill">Mobile</button>
        <button className="pill">Computing</button>
        <button className="pill">Gaming</button>
      </div>
    </section>

    {/* TOOLBAR */}
    <section className="wrap" style={{marginTop: '1.5rem'}}>
      <div className="toolbar">
        <div className="count"><b>{products.length}</b> products · <span>All categories</span></div>
        <div className="toolbar-right">
          <button className="select only-mobile"><svg><use href="#i-sliders"/></svg><span>Filters</span></button>
          <button className="select"><span className="lbl">Sort</span>Featured <svg><use href="#i-down"/></svg></button>
        </div>
      </div>
    </section>

    {/* LAYOUT: FILTERS + GRID */}
    <section className="wrap shop-layout">
      {/* FILTER RAIL */}
      <aside className="filters" aria-label="Filters">
        <div className="fgroup">
          <h4>Category <svg><use href="#i-down"/></svg></h4>
          <label className="check on"><span className="box"><svg><use href="#i-check"/></svg></span>Headphones<span className="n">08</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Earbuds<span className="n">06</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Speakers<span className="n">04</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Smart watches<span className="n">03</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Charging<span className="n">05</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Gaming<span className="n">04</span></label>
        </div>
        <div className="fgroup">
          <h4>Price <svg><use href="#i-down"/></svg></h4>
          <div className="ruler">
            <div className="track"><div className="fill"></div><span className="knob a"></span><span className="knob b"></span></div>
            <div className="ends"><span>₹2,499</span><span>₹24,999</span></div>
          </div>
        </div>
        <div className="fgroup">
          <h4>Finish <svg><use href="#i-down"/></svg></h4>
          <div className="swatch-row">
            <span className="sw on" style={{background: '#111'}} title="Onyx"></span>
            <span className="sw" style={{background: '#EDEBE6'}} title="Linen"></span>
            <span className="sw" style={{background: '#5A5A60'}} title="Graphite"></span>
            <span className="sw" style={{background: '#C9F24C'}} title="Lime"></span>
          </div>
        </div>
        <div className="fgroup">
          <h4>Availability <svg><use href="#i-down"/></svg></h4>
          <label className="check on"><span className="box"><svg><use href="#i-check"/></svg></span>In stock<span className="n">21</span></label>
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>Pre-order<span className="n">03</span></label>
        </div>
        <div className="filter-actions">
          <button className="btn btn-dark btn-block">Apply</button>
          <button className="btn">Reset</button>
        </div>
      </aside>

      {/* PRODUCT GRID */}
      <div>
        <div className="grid-products">
          {products.length === 0 ? <p>Loading products...</p> : products.map((p: any, index: number) => {
            
            return (
              <React.Fragment key={p._id}>
                {/* Insert editorial break after 4 items just like the design */}
                {index === 4 && (
                  <div className="grid-note">
                    <div className="spark-field"></div>
                    <div className="eyebrow">ecompitch H1 silicon</div>
                    <h3>Same chip. Every category. That's why it all just works together.</h3>
                    <a href="#" className="linkline" style={{color: '#fff'}}>How we build <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
                  </div>
                )}
                
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} className="card">
                  <div className="card-media">
                    {p.salePrice && <div className="card-badges"><span className="badge badge-accent">Sale</span></div>}
                    <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
                    <img className="solo" src={p.images?.[0]?.url || 'assets/cord-one.svg'} alt={p.name} />
                    <div className="card-quick" onClick={(e) => { e.stopPropagation(); e.preventDefault(); addToCart(p, 1); }}>
                      <span className="btn btn-dark btn-block">Add to cart</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-cat">{p.category?.name || p.category || 'Tech'}</div>
                    <div className="card-name">{p.name}</div>
                    <p className="card-desc" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.description || 'Premium ecompitch product'}</p>
                    <div className="card-foot">
                      <span className="price">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.salePrice && <span className="price-was">₹{p.salePrice.toLocaleString('en-IN')}</span>}
                      {p.salePrice && <span className="price-off">−{Math.round((1 - p.price / p.salePrice) * 100)}%</span>}
                      {!p.salePrice && <span className="card-rate"><svg><use href="#i-star"/></svg>4.8</span>}
                    </div>
                  </div>
                </a>
              </React.Fragment>
            );
          })}
        </div>

        {/* PAGINATION */}
        <nav className="pager" aria-label="Pagination">
          <span className="on">1</span><a href="#">2</a><a href="#">3</a><span>…</span><a href="#">6</a>
          <a href="#" className="nxt">Next <svg className="btn-ico" style={{width: '15px', height: '15px'}}><use href="#i-arrow"/></svg></a>
        </nav>
      </div>
    </section>
  </main>
)


const MobileBottomNav = ({ activeTab, setActiveTab, cart, setShowCart }: any) => (
  <div className="mobile-bottom-nav">
    <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
      <svg><use href="#i-search" /></svg>
      <span>Home</span>
    </div>
    <div className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
      <svg><use href="#i-menu" /></svg>
      <span>Shop</span>
    </div>
    <div className="nav-item" onClick={() => setShowCart(true)}>
      <div style={{ position: 'relative' }}>
        <svg><use href="#i-cart" /></svg>
        {cart.length > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', borderRadius: '50%', padding: '0 4px', fontSize: '9px', fontWeight: 'bold' }}>{cart.length}</span>}
      </div>
      <span>Cart</span>
    </div>
    <div className="nav-item">
      <svg><use href="#i-user" /></svg>
      <span>Profile</span>
    </div>
  </div>
)

import { productApi } from '../lib/api'

export default function Storefront() {
  
  const [activeTab, _setActiveTab] = useState<'home' | 'shop' | 'product'>('home')
  const setActiveTab = (tab: 'home'|'shop'|'product', product?: any) => {
    _setActiveTab(tab)
    if (product) setSelectedProduct(product)
  }

  const [cart, setCart] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

    useEffect(() => {
    productApi.getAll().then(res => setProducts(res.products || [])).catch(console.error)
  }, [])

  useEffect(() => {
    const savedCart = localStorage.getItem('ecompitch_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {}
    }
  }, [])

  const addToCart = (product: any, quantity: number) => {
    const newCart = [...cart]
    const existing = newCart.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      newCart.push({ ...product, quantity })
    }
    setCart(newCart)
    localStorage.setItem('ecompitch_cart', JSON.stringify(newCart))
    setShowCart(true)
  }

  return (
    <>
      <Icons />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} setShowCart={setShowCart} />
      {activeTab === 'home' && <Homepage setActiveTab={setActiveTab} />}
      {activeTab === 'shop' && <ShopPage setActiveTab={setActiveTab} products={products} addToCart={addToCart} />}
      {activeTab === 'product' && <main>

<section className="wrap pd">
  <nav className="crumbs pd-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span className="sep">/</span><a href="shop.html">Audio</a><span className="sep">/</span>Headphones<span className="sep">/</span>Pro 2</nav>

  <div className="pd-grid">
    
    <div className="gallery">
      <input className="gal-radio" type="radio" name="gal" id="gv1" defaultChecked aria-label="View: three-quarter" />
      <input className="gal-radio" type="radio" name="gal" id="gv2" aria-label="View: front" />
      <input className="gal-radio" type="radio" name="gal" id="gv3" aria-label="View: folded" />
      <input className="gal-radio" type="radio" name="gal" id="gv4" aria-label="View: driver detail" />
      <div className="pd-galwrap">
        <div className="thumbs">
          <label className="thumb" htmlFor="gv1"><img src="assets/pro2-01.svg" alt="Pro 2 three-quarter view" /></label>
          <label className="thumb" htmlFor="gv2"><img src="assets/pro2-02.svg" alt="Pro 2 front view" /></label>
          <label className="thumb" htmlFor="gv3"><img src="assets/pro2-03.svg" alt="Pro 2 folded" /></label>
          <label className="thumb" htmlFor="gv4"><img src="assets/pro2-04.svg" alt="Pro 2 ear-cushion detail" /></label>
        </div>
        <div className="stage-img">
          <span className="badge badge-dark">Best seller</span>
          <img className="gimg g1" src="assets/pro2-01.svg" alt="ecompitch Pro 2 over-ear headphones, three-quarter view" />
          <img className="gimg g2" src="assets/pro2-02.svg" alt="ecompitch Pro 2, front view" />
          <img className="gimg g3" src="assets/pro2-03.svg" alt="ecompitch Pro 2, folded flat" />
          <img className="gimg g4" src="assets/pro2-04.svg" alt="ecompitch Pro 2, 40mm driver detail" />
          <span className="gallery-callout"><span className="node"></span>Onyx · aluminium frame</span>
          <span className="zoom-note"><svg><use href="#i-zoom"/></svg>Hover to zoom</span>
        </div>
      </div>
    </div>

    
    <div className="pd-info">
      <div className="pd-cat eyebrow is-live">Headphones · Flagship</div>
      <h1 className="pd-title">ecompitch Pro 2 <span className="thin">Over-ear ANC</span></h1>

      <div className="pd-rate">
        <span className="stars"><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg></span>
        <span>4.9</span><span className="sep"></span><span>2,481 reviews</span><span className="sep"></span><span>SKU EC-PRO2-ONX</span>
      </div>

      <div className="pd-price">
        <span className="now">₹24,999</span><span className="was">₹29,999</span><span className="off">SAVE 17%</span>
      </div>
      <div className="pd-tax">Incl. of all taxes · No-cost EMI from ₹4,166/mo</div>

      <p className="pd-desc">Immersive spatial audio, adaptive noise cancellation, and all-day comfort — in a frame machined to disappear the moment you put it on.</p>

      
      <div className="pd-block">
        <div className="lbl">Finish <span className="val">Onyx</span></div>
        <div className="finishes">
          <button className="finish on" aria-label="Onyx"><span className="dot" style={{background: "linear-gradient(145deg,#3a3a40,#0c0c0e)"}}></span><span className="cap">Onyx</span></button>
          <button className="finish" aria-label="Linen"><span className="dot" style={{background: "linear-gradient(145deg,#fcfbf8,#cbc8c0)"}}></span><span className="cap">Linen</span></button>
          <button className="finish" aria-label="Graphite"><span className="dot" style={{background: "linear-gradient(145deg,#5a5a60,#16171a)"}}></span><span className="cap">Graphite</span></button>
        </div>
      </div>

      
      <div className="pd-block">
        <div className="lbl">Quantity <span className="avail"><span className="live"></span>In stock · ships today</span></div>
        <div className="pd-buy">
          <div className="qty">
            <button aria-label="Decrease quantity"><svg style={{width: "16px", height: "16px"}}><use href="#i-minus"/></svg></button>
            <span className="v">1</span>
            <button aria-label="Increase quantity"><svg style={{width: "16px", height: "16px"}}><use href="#i-plus"/></svg></button>
          </div>
          <button className="btn btn-dark btn-lg">Add to cart</button>
          <button className="btn btn-accent btn-lg">Buy now</button>
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
      <img src="assets/pro2-01.svg" alt="ecompitch Pro 2 on a dark stage" />
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
      <p style={{ marginBottom: '1rem' }}>Immersive spatial audio, adaptive noise cancellation, and all-day comfort — in a frame machined to disappear the moment you put it on.</p>
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

</main>}
      <Footer />
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} setShowCart={setShowCart} />
    </>
  )
}
