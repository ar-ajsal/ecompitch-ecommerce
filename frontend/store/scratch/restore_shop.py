import re

file_path = r"c:\Users\User\OneDrive\Desktop\barter-1\frontend\store\components\storefront.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# The user wants the original `.card` premium UI design for the products in the ShopPage

new_shop_page = """const ShopPage = ({ setActiveTab, products, addToCart }: any) => (
  <main style={{ paddingBottom: "80px" }}>
    <section className="section wrap">
      <div className="sec-head" style={{marginTop: '2rem'}}>
        <h1 className="h1">All Products</h1>
      </div>
      {/* Use the original premium .shelf layout instead of a generic grid */}
      <div className="shelf" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {products.length === 0 ? <p>Loading products...</p> : products.map((p: any) => (
          <div key={p._id} className="card">
            <div className="card-media">
              {p.salePrice && <div className="card-badges"><span className="badge badge-accent">Sale</span></div>}
              <button className="wish card-wish" aria-label="Add to wishlist"><svg><use href="#i-heart"/></svg></button>
              <img className="solo" src={p.images?.[0]?.url || 'assets/cord-one.svg'} alt={p.name} onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} style={{cursor: 'pointer'}} />
              <div className="card-quick">
                <span className="btn btn-dark btn-block" onClick={() => addToCart(p, 1)}>Add to cart</span>
              </div>
            </div>
            <div className="card-body">
              <div className="card-cat">{p.category?.name || p.category || 'Tech'}</div>
              <div className="card-name" onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} style={{cursor: 'pointer'}}>{p.name}</div>
              <p className="card-desc" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.description || 'Premium ecompitch product'}</p>
              <div className="card-foot">
                <span className="price">₹{p.price.toLocaleString('en-IN')}</span>
                <span className="card-rate"><svg><use href="#i-star"/></svg>4.8</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
)"""

start_idx = code.find("const ShopPage =")
end_idx = code.find("const MobileBottomNav =")

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_shop_page + "\n\n" + code[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully restored the premium UI to the Shop page!")
else:
    print("Could not find ShopPage boundaries.")
