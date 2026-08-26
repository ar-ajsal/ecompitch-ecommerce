'use client'

import React, { useState, useEffect } from 'react'
import ProductDetail from './product-detail'
import { productApi, settingsApi, getToken, type ApiSettings, categoriesApi } from '../lib/api'
import { useRouter, usePathname } from 'next/navigation'

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

const Homepage = ({ setActiveTab, products, setSelectedProduct }: any) => {
  const [sliderState, setSliderState] = useState<'normal' | 'next' | 'prev' | 'showDetail'>('normal');
  const [items, setItems] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (products && products.length > 0 && !isInitialized) {
      const sliderProducts = products.filter((p: any) => p.inSlider);
      const displayProducts = sliderProducts.length > 0 ? sliderProducts : products.slice(0, 6);

      const formattedItems = displayProducts.map((p: any, index: number) => ({
        id: p._id || Math.random().toString(),
        img: p.images?.[0]?.url || `/slider/img${(index % 6) + 1}.png`,
        title: p.name,
        topic: p.category || 'Product',
        des: p.description || 'Discover our premium selection.',
        price: p.salePrice || p.price,
        product: p
      }));
      
      if (formattedItems.length > 0) {
        setItems(formattedItems);
        setIsInitialized(true);
      }
    }
  }, [products, isInitialized]);

  const showSlider = (type: 'next' | 'prev') => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);
    setSliderState(type);
    
    if (type === 'next') {
      setItems((prev) => prev.length > 0 ? [...prev.slice(1), prev[0]] : prev);
    } else {
      setItems((prev) => prev.length > 0 ? [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)] : prev);
    }

    setTimeout(() => {
      setIsAnimating(false);
      setSliderState('normal');
    }, 2000); // Wait for transition to complete
  };

  useEffect(() => {
    if (sliderState === 'showDetail') return;
    const timer = setInterval(() => {
      showSlider('next');
    }, 3000);
    return () => clearInterval(timer);
  }, [items, sliderState, isAnimating]);

  const handleSeeMore = () => {
    setSliderState('showDetail');
  };

  const handleItemClick = (index: number) => {
    if (index === 1 && sliderState === 'normal') {
      setSliderState('showDetail');
    }
  };

  const handleCheckout = (item: any) => {
    if (item.product) {
      setActiveTab('product', item.product);
    }
  };

  const handleBack = () => {
    setSliderState('normal');
  };

  return (
    <main style={{ paddingBottom: "80px" }}>
      {items.length > 0 && (
      <section className={`carousel ${sliderState !== 'normal' ? sliderState : ''}`}>
        <div className="list">
          {items.map((item, index) => (
            <div className="item" key={item.id} onClick={() => handleItemClick(index)}>
              <img src={item.img} alt={item.title} />
              <div className="introduce">
                <div className="title">FEATURED PRODUCT</div>
                <div className="topic">{item.topic}</div>
                <div className="des">{item.des}</div>
                <button className="seeMore" onClick={(e) => { e.stopPropagation(); handleSeeMore(); }}>SEE MORE &#8599;</button>
              </div>
              <div className="detail">
                <div className="title">{item.title}</div>
                <div className="des">
                  {item.des}
                </div>
                <div className="specifications">
                  {item.product?.specifications?.slice(0, 5).map((spec: any, i: number) => (
                    <div key={i}>
                      <p>{spec.name}</p>
                      <p>{spec.value}</p>
                    </div>
                  ))}
                </div>
                <div className="checkout">
                  <button onClick={(e) => { e.stopPropagation(); handleCheckout(item); }}>ADD TO CART</button>
                  <button onClick={(e) => { e.stopPropagation(); handleCheckout(item); }}>CHECKOUT</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="arrows">
          <button id="prev" onClick={() => showSlider('prev')}>&lt;</button>
          <button id="next" onClick={() => showSlider('next')}>&gt;</button>
          <button id="back" onClick={handleBack}>See All &#8599;</button>
        </div>
      </section>
      )}

      {/*  ============ FEATURED COLLECTION ============  */}
      <section className="section-tight wrap">
        <div className="sec-head">
          <div className="titles"><div className="eyebrow is-live">Featured collection</div><h2 className="h2">Worth owning.</h2></div>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="linkline">View all <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
        </div>
        <div className="shelf">
          {products.slice(0, 3).map((p: any, i: number) => (
            <a key={p._id} href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} className="card">
              <div className="card-media">
                {i === 0 && <div className="card-badges"><span className="badge badge-dark">Best seller</span></div>}
                <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
                <img className="main" src={p.images?.[0]?.url || ''} alt={p.name} />
                <img className="alt" src={p.images?.[1]?.url || p.images?.[0]?.url || ''} alt="" />
                <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
              </div>
              <div className="card-body">
                <div className="card-cat">{p.category}</div>
                <div className="card-name">{p.name}</div>
                <p className="card-desc">{p.description?.substring(0, 40)}{p.description?.length > 40 ? '...' : ''}</p>
                <div className="card-foot">
                  <span className="price">₹{(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                  {p.salePrice && <span className="price-was">₹{p.price.toLocaleString('en-IN')}</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/*  ============ NEW ARRIVALS ============  */}
      <section className="section-tight wrap">
        <div className="sec-head">
          <div className="titles"><div className="eyebrow">Just landed</div><h2 className="h2">New arrivals.</h2></div>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }} className="linkline">See what's new <svg className="btn-ico"><use href="#i-arrow"/></svg></a>
        </div>
        <div className="shelf">
          {products.slice(-4).map((p: any, i: number) => (
            <a key={p._id} href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} className="card">
              <div className="card-media">
                {i === 0 && <div className="card-badges"><span className="badge badge-accent">New</span></div>}
                <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
                <img className="solo" src={p.images?.[0]?.url || ''} alt={p.name} />
                <div className="card-quick"><span className="btn btn-dark btn-block">Add to cart</span></div>
              </div>
              <div className="card-body">
                <div className="card-cat">{p.category}</div>
                <div className="card-name">{p.name}</div>
                <p className="card-desc">{p.description?.substring(0, 40)}{p.description?.length > 40 ? '...' : ''}</p>
                <div className="card-foot">
                  <span className="price">₹{(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                  {p.salePrice && <span className="price-was">₹{p.price.toLocaleString('en-IN')}</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};

const ShopPage = ({ setActiveTab, products, addToCart, setSelectedProduct, categories }: any) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  
  // Only show categories that have at least one product
  const availableCategories = categories.filter((cat: any) => 
    products.some((p: any) => p.category === cat.name)
  );

  const filteredProducts = selectedCat === 'All' 
    ? products 
    : products.filter((p: any) => p.category === selectedCat);

  return (
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
        <button className={`pill ${selectedCat === 'All' ? 'is-active' : ''}`} onClick={() => setSelectedCat('All')}>
          {selectedCat === 'All' && <span className="dot"></span>}All
        </button>
        {availableCategories.map((c: any) => (
          <button 
            key={c._id} 
            className={`pill ${selectedCat === c.name ? 'is-active' : ''}`}
            onClick={() => setSelectedCat(c.name)}
          >
            {selectedCat === c.name && <span className="dot"></span>}
            {c.name}
          </button>
        ))}
      </div>
    </section>

    {/* TOOLBAR */}
    <section className="wrap" style={{marginTop: '1.5rem'}}>
      <div className="toolbar">
        <div className="count"><b>{filteredProducts.length}</b> products · <span>{selectedCat === 'All' ? 'All categories' : selectedCat}</span></div>
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
          <label className="check"><span className="box"><svg><use href="#i-check"/></svg></span>All<span className="n">{products.length}</span></label>
          {availableCategories.map((c: any) => {
            const count = products.filter((p: any) => p.category === c.name).length;
            return (
              <label key={c._id} className={`check ${selectedCat === c.name ? 'on' : ''}`} onClick={() => setSelectedCat(c.name)}>
                <span className="box"><svg><use href="#i-check"/></svg></span>{c.name}<span className="n">{count < 10 ? `0${count}` : count}</span>
              </label>
            )
          })}
        </div>

      </aside>

      {/* PRODUCT GRID */}
      <div>
        <div className="grid-products">
          {filteredProducts.map((p: any, index: number) => {
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
}


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


// ─── WhatsApp cart message builder ───────────────────────────────────────────
function buildCartWhatsAppLink(cart: any[], whatsappNumber: string): string {
  if (!whatsappNumber || cart.length === 0) return ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const itemLines = cart.map((item: any) =>
    `• ${item.name} × ${item.quantity} — ₹${((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}`
  ).join('\n')
  const total = cart.reduce((acc: number, item: any) => acc + (item.salePrice || item.price) * item.quantity, 0)
  const msg = [
    `Hi, I would like to place an order.`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Total: ₹${total.toLocaleString('en-IN')}`,
    ``,
    `Store: ${origin}`,
  ].join('\n')
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
}

// ─── FloatingWhatsApp FAB ─────────────────────────────────────────────────────
const FloatingWhatsApp = ({ whatsappNumber }: { whatsappNumber: string }) => {
  if (!whatsappNumber) return null
  const msg = encodeURIComponent('Hi, I need help with an order.')
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '88px',  /* above mobile bottom nav */
        right: '20px',
        zIndex: 8888,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(37,211,102,0.5)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.4)' }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  )
}

// ─── CartDrawer ───────────────────────────────────────────────────────────────
const CartDrawer = ({
  showCart, setShowCart, cart, setCart, settings
}: {
  showCart: boolean
  setShowCart: (v: boolean) => void
  cart: any[]
  setCart: (c: any[]) => void
  settings: Partial<ApiSettings>
}) => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart')
  const [error, setError] = useState('')
  const [utrNumber, setUtrNumber] = useState('')
  const [paymentScreenshot, setPaymentScreenshot] = useState<{ url: string; publicId: string } | null>(null)
  const [uploadingScreen, setUploadingScreen] = useState(false)
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ecompitch_address')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return {
      fullName: '',
      phone: '',
      email: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      alternatePhone: '',
    }
  })

  const { whatsappEnabled, whatsappNumber, manualUpiEnabled, upiId, upiBusinessName, upiQrImage, paymentInstructions, shippingCharge, freeShippingThreshold } = settings as any

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.salePrice || item.price) * item.quantity, 0)
  const freeLimit = freeShippingThreshold !== undefined ? freeShippingThreshold : 2000
  const deliveryCost = shippingCharge !== undefined ? shippingCharge : 99
  const delivery = subtotal > 0 && subtotal < freeLimit ? deliveryCost : 0
  const total = subtotal + delivery

  const saveCart = (newCart: any[]) => {
    setCart(newCart)
    localStorage.setItem('ecompitch_cart', JSON.stringify(newCart))
  }

  const updateQty = (idx: number, delta: number) => {
    const c = [...cart]
    c[idx].quantity = Math.max(1, c[idx].quantity + delta)
    saveCart(c)
  }

  const removeItem = (idx: number) => {
    const c = cart.filter((_: any, i: number) => i !== idx)
    saveCart(c)
  }

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value }
    setForm(updated)
    localStorage.setItem('ecompitch_address', JSON.stringify(updated))
  }

  const isAddressValid = () =>
    Boolean(
      form.fullName?.trim() &&
      form.phone?.trim() &&
      form.street?.trim() &&
      form.city?.trim() &&
      form.state?.trim() &&
      form.pincode?.trim()
    )

  // ── WhatsApp cart order ──
  const handleWhatsAppOrder = async () => {
    const num = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    if (!num) { setError('WhatsApp ordering is not configured. Please contact support.'); return }
    
    setLoading(true)
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const orderRes = await fetch(`${BASE}/api/orders/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shippingAddress: form, 
          cartItems: cart,
          paymentMethod: 'whatsapp'
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed')

      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const itemLines = cart.map((item: any) =>
        `• ${item.name} × ${item.quantity} — ₹${((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}`
      ).join('\n')
      
      const addrDetails = [
        `Name: ${form.fullName}`,
        `Phone: ${form.phone}${form.alternatePhone ? ` (Alt: ${form.alternatePhone})` : ''}`,
        form.email ? `Email: ${form.email}` : '',
        `Address: ${form.street}`,
        form.landmark ? `Landmark: ${form.landmark}` : '',
        `City: ${form.city}, State: ${form.state}`,
        `PIN Code: ${form.pincode}`
      ].filter(Boolean).join('\n')

      const msg = [
        `Hi, I would like to place an order.`,
        ``,
        `Items:`,
        itemLines,
        ``,
        `Total: ₹${total.toLocaleString('en-IN')}`,
        ``,
        `Delivery Address:`,
        `${addrDetails}`,
        ``,
        `Order ID: #${orderData._id ? orderData._id.slice(-6).toUpperCase() : 'PENDING'}`,
        `Store: ${origin}`,
      ].join('\n')
      
      const link = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
      window.open(link, '_blank', 'noopener,noreferrer')

      setCart([])
      localStorage.removeItem('ecompitch_cart')
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingScreen(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      setPaymentScreenshot(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingScreen(false)
    }
  }

  // ── Manual Payment Checkout ──
  const handleManualCheckout = async () => {
    if (!utrNumber.trim()) { setError('Please enter the UTR / Transaction ID.'); return }
    setError('')
    setLoading(true)
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const orderRes = await fetch(`${BASE}/api/orders/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shippingAddress: form, 
          cartItems: cart,
          utrNumber: utrNumber.trim(),
          paymentScreenshot,
          paymentMethod: 'manual_upi'
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed')

      setCart([])
      localStorage.removeItem('ecompitch_cart')
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reset step when drawer closes
  React.useEffect(() => { if (!showCart) { setStep('cart'); setError(''); setUtrNumber(''); setPaymentScreenshot(null); } }, [showCart])

  if (!showCart) return null

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #e0e0e0',
    borderRadius: '8px', outline: 'none', background: 'var(--surface, #fff)',
    color: 'var(--ink, #111)', boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) setShowCart(false) }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--surface, #fff)', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--line, #eaeaea)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {step === 'address' && (
              <button onClick={() => setStep('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2, #666)', padding: '4px', display: 'flex', alignItems: 'center' }}>
                ← 
              </button>
            )}
            {step === 'payment' && (
              <button onClick={() => setStep('address')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-2, #666)', padding: '4px', display: 'flex', alignItems: 'center' }}>
                ← 
              </button>
            )}
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              {step === 'cart' ? `Cart (${cart.reduce((a: number, i: any) => a + i.quantity, 0)})` : step === 'address' ? 'Delivery Details' : step === 'payment' ? 'Payment' : 'Order Placed'}
            </h2>
          </div>
          <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--ink-2, #666)', lineHeight: 1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-2, #888)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
                  <p style={{ margin: 0 }}>Your cart is empty</p>
                  <button onClick={() => setShowCart(false)} style={{ marginTop: '20px', padding: '10px 24px', background: 'var(--ink, #111)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Continue Shopping</button>
                </div>
              ) : (
                cart.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid var(--line, #eaeaea)' }}>
                    <img
                      src={item.images?.[0]?.url || '/placeholder.svg'}
                      style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, background: '#f5f5f5' }}
                      alt={item.name}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>{item.name}</h4>
                        <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3, #aaa)', flexShrink: 0, padding: '2px', fontSize: '16px', lineHeight: 1 }} title="Remove">×</button>
                      </div>
                      <p style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '15px' }}>₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => updateQty(i, -1)} disabled={item.quantity <= 1} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--line, #e0e0e0)', background: 'var(--surface, #fff)', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.4 : 1 }}>−</button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(i, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--line, #e0e0e0)', background: 'var(--surface, #fff)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {step === 'address' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-2, #666)' }}>Where should we deliver your order?</p>
                <span style={{ fontSize: '11px', color: 'var(--ink-3, #999)' }}>* Required</span>
              </div>

              {/* Full Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Full Name *</label>
                  <input name="fullName" type="text" value={form.fullName || ''} onChange={handleField} placeholder="Your name" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Phone Number *</label>
                  <input name="phone" type="tel" value={form.phone || ''} onChange={handleField} placeholder="10-digit mobile" style={inputStyle} required />
                </div>
              </div>

              {/* Email & Alternate Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Email (optional)</label>
                  <input name="email" type="email" value={form.email || ''} onChange={handleField} placeholder="you@example.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Alt Phone (optional)</label>
                  <input name="alternatePhone" type="tel" value={form.alternatePhone || ''} onChange={handleField} placeholder="Secondary number" style={inputStyle} />
                </div>
              </div>

              {/* House / Flat / Building & Street */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>House / Flat / Building & Street *</label>
                <input name="street" type="text" value={form.street || ''} onChange={handleField} placeholder="Flat/House No., Building, Street Name" style={inputStyle} required />
              </div>

              {/* Landmark / Area */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Landmark / Area (optional)</label>
                <input name="landmark" type="text" value={form.landmark || ''} onChange={handleField} placeholder="Near landmark, sector, or locality" style={inputStyle} />
              </div>

              {/* City, State & PIN Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>City *</label>
                  <input name="city" type="text" value={form.city || ''} onChange={handleField} placeholder="City / Town" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>State *</label>
                  <input name="state" type="text" value={form.state || ''} onChange={handleField} placeholder="State" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>PIN Code *</label>
                  <input name="pincode" type="text" value={form.pincode || ''} onChange={handleField} placeholder="6-digit PIN" maxLength={10} style={inputStyle} required />
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: 'var(--ink, #111)' }}>
                  Pay ₹{total.toLocaleString('en-IN')}
                </p>
                {manualUpiEnabled && upiQrImage?.url && (
                  <img src={upiQrImage.url} alt="UPI QR Code" style={{ width: '160px', height: '160px', objectFit: 'contain', margin: '0 auto 12px', borderRadius: '8px', border: '1px solid #eaeaea', background: '#fff', padding: '8px' }} />
                )}
                {manualUpiEnabled && upiId && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: 'fit-content', margin: '0 auto' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{upiId}</span>
                    <button onClick={() => { navigator.clipboard.writeText(upiId); alert('UPI ID copied!') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>Copy</button>
                  </div>
                )}
                {manualUpiEnabled && upiBusinessName && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>{upiBusinessName}</p>}
                {manualUpiEnabled && paymentInstructions && <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>{paymentInstructions}</p>}
                
                {!manualUpiEnabled && whatsappEnabled && (
                   <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#555', lineHeight: '1.4' }}>Complete your order via WhatsApp.</p>
                )}
              </div>

              {manualUpiEnabled && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>UTR / Transaction ID *</label>
                    <input value={utrNumber} onChange={e => setUtrNumber(e.target.value)} placeholder="Enter 12-digit UTR" style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--ink-2, #555)' }}>Payment Screenshot (Optional)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#374151', transition: 'background 0.2s' }}>
                        {uploadingScreen ? 'Uploading...' : paymentScreenshot ? 'Change Image' : 'Upload Screenshot'}
                        <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={handleUploadScreenshot} />
                      </label>
                      {paymentScreenshot?.url && (
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>✓ Uploaded</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
              <h3 style={{ fontSize: '20px', margin: '0 0 8px' }}>Order Placed!</h3>
              <p style={{ margin: '0 0 24px', color: '#666', lineHeight: '1.5' }}>Your order is pending verification.<br/>We'll notify you once confirmed.</p>
              <button onClick={() => setShowCart(false)} style={{ padding: '12px 24px', background: 'var(--ink, #111)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Continue Shopping</button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && step !== 'success' && (
          <div style={{ borderTop: '1px solid var(--line, #eaeaea)', padding: '20px 24px' }}>

            {/* Order summary */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-2, #666)', marginBottom: '6px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-2, #666)', marginBottom: '6px' }}>
                <span>Delivery</span>
                <span style={{ color: delivery === 0 ? '#16a34a' : 'inherit' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '700', paddingTop: '10px', borderTop: '1px solid var(--line, #eaeaea)' }}>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: '13px', margin: '0 0 12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px' }}>{error}</p>}

            {/* CTAs — settings-driven */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Cart Step -> Go to Address */}
              {(manualUpiEnabled || whatsappEnabled) && step === 'cart' && (
                <button
                  onClick={() => setStep('address')}
                  style={{ padding: '14px', background: 'var(--ink, #111)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Checkout
                </button>
              )}

              {/* Address Step -> Go to Payment */}
              {(manualUpiEnabled || whatsappEnabled) && step === 'address' && (
                <button
                  onClick={() => setStep('payment')}
                  disabled={!isAddressValid()}
                  style={{ padding: '14px', background: !isAddressValid() ? '#999' : 'var(--ink, #111)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: !isAddressValid() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Continue to Payment
                </button>
              )}

              {/* Payment Step: UPI / WhatsApp Buttons */}
              {step === 'payment' && (
                <>
                  {manualUpiEnabled && (
                    <button
                      onClick={handleManualCheckout}
                      disabled={loading || !utrNumber.trim()}
                      style={{ padding: '14px', background: loading || !utrNumber.trim() ? '#999' : 'var(--ink, #111)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading || !utrNumber.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}
                    >
                      {loading ? 'Processing…' : 'Confirm UPI Order'}
                    </button>
                  )}
                  {whatsappEnabled && (
                    <button
                      onClick={handleWhatsAppOrder}
                      disabled={loading}
                      style={{ padding: '14px', background: loading ? '#999' : '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      {loading ? 'Processing…' : 'Order via WhatsApp'}
                    </button>
                  )}
                </>
              )}

              {/* Fallback: neither enabled */}
              {!manualUpiEnabled && !whatsappEnabled && (
                <div style={{ textAlign: 'center', padding: '14px', background: '#f9fafb', borderRadius: '10px', fontSize: '13px', color: 'var(--ink-2, #666)', border: '1px solid var(--line, #e5e7eb)' }}>
                  <p style={{ margin: '0 0 6px', fontWeight: '600' }}>Ready to order?</p>
                  <p style={{ margin: 0 }}>Please contact us directly to complete your purchase.</p>
                </div>
              )}

            </div>

            {delivery === 0 && subtotal > 0 && (
              <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>🎉 You qualify for free delivery!</p>
            )}
            {delivery > 0 && (
              <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: '12px', color: 'var(--ink-2, #888)' }}>Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free delivery</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


export default function Storefront() {
  const router = useRouter()
  const pathname = usePathname()
  
  const [activeTab, _setActiveTab] = useState<'home' | 'shop' | 'product'>('home')
  const setActiveTab = (tab: 'home' | 'shop' | 'product', product?: any) => {
    _setActiveTab(tab)
    if (product) setSelectedProduct(product)
    
    if (tab === 'home' && pathname !== '/') router.push('/')
    if (tab === 'shop' && pathname !== '/shop') router.push('/shop')
    if (tab === 'product' && product && pathname !== '/product/' + product._id) router.push('/product/' + product._id)
  }

  useEffect(() => {
    if (pathname) {
      if (pathname.startsWith('/product/')) {
        const id = pathname.split('/')[2];
        if (id) {
          _setActiveTab('product');
          setSelectedProduct({ _id: id });
        }
      } else if (pathname === '/shop') {
        _setActiveTab('shop');
      } else {
        _setActiveTab('home');
      }
    }
  }, [pathname]);

  const [cart, setCart] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [settings, setSettings] = useState<Partial<ApiSettings>>({})

  // Load products and categories
  useEffect(() => {
    productApi.getAll().then(res => setProducts(res.products || [])).catch(console.error)
    categoriesApi.getAll().then(res => setCategories(res || [])).catch(console.error)
  }, [])

  // Load settings from backend (source of truth for WhatsApp / payment toggles)
  useEffect(() => {
    settingsApi.get()
      .then(s => setSettings(s))
      .catch(() => {
        // Fallback: if backend is unreachable, use env var for WhatsApp
        const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
        if (num) setSettings({ whatsappEnabled: true, whatsappNumber: num, onlinePaymentEnabled: false })
      })
  }, [])

  // Restore cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ecompitch_cart')
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)) } catch {}
    }
  }, [])

  const addToCart = (product: any, quantity: number) => {
    const newCart = [...cart]
    const existing = newCart.find(i => i._id === product._id)
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
      <CartDrawer showCart={showCart} setShowCart={setShowCart} cart={cart} setCart={setCart} settings={settings} />
      {settings.whatsappEnabled && settings.whatsappNumber && (
        <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
      )}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} setShowCart={setShowCart} />

      {activeTab === 'home' && <Homepage setActiveTab={setActiveTab} products={products} setSelectedProduct={setSelectedProduct} />}
      {activeTab === 'shop' && <ShopPage setActiveTab={setActiveTab} products={products} categories={categories} addToCart={addToCart} setSelectedProduct={setSelectedProduct} />}
      {activeTab === 'product' && selectedProduct && (
        <ProductDetail 
          productId={selectedProduct._id} 
          onAdd={addToCart} 
          count={cart.find((c: any) => c._id === selectedProduct._id)?.quantity || 0} 
          allProducts={products} 
          settings={settings} 
          setShowCart={setShowCart}
          setActiveTab={setActiveTab}
          setSelectedProduct={setSelectedProduct}
        />
      )}
      <Footer />
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} setShowCart={setShowCart} />
    </>
  )
}
