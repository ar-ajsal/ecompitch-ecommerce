import os

file_path = r'c:\Users\User\OneDrive\Desktop\barter-1\frontend\store\components\storefront.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('const ShopPage =')
end_idx = code.find('const MobileBottomNav =')

new_shop_page = """const ShopPage = ({ setActiveTab, products, addToCart }: any) => (
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
"""

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_shop_page + "\n\n" + code[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully injected the complete requested Shop UI!")
else:
    print("Could not find ShopPage boundaries.")
