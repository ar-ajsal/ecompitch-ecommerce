import os

file_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\components\storefront.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# We want to replace the `const ShopPage` entirely.
# And add `MobileBottomNav`.
# And replace `export default function Storefront()` to include fetching products and adding the nav.

# First, find where `const ShopPage = ` starts and ends
shop_start = code.find("const ShopPage =")
shop_end = code.find("export default function Storefront")

new_shop = """const ShopPage = ({ setActiveTab, products, addToCart }: any) => (
  <main>
    <section className="section wrap">
      <div className="sec-head" style={{marginTop: '2rem'}}>
        <h1 className="h1">All Products</h1>
      </div>
      <div className="products-grid">
        {products.length === 0 ? <p>Loading products...</p> : products.map((p: any) => (
          <div key={p._id} className="product-card">
            <div className="product-card-img-wrap" onClick={(e) => { e.preventDefault(); setActiveTab("product", p); }} style={{cursor: 'pointer'}}>
              <img src={p.images?.[0]?.url || 'assets/headphones-onyx.svg'} alt={p.name} />
            </div>
            <div className="product-card-details">
              <div className="product-card-brand">{p.brand || 'ecompitch'}</div>
              <div className="product-card-title">{p.name}</div>
              <div className="product-card-rating">
                <svg><use href="#i-star" /></svg> 4.8 (120)
              </div>
              <div className="product-card-price-row">
                <div className="product-card-price">₹{p.price.toLocaleString('en-IN')}</div>
                {p.salePrice && <div className="product-card-original-price">₹{p.salePrice.toLocaleString('en-IN')}</div>}
                {p.salePrice && <div className="product-card-discount">{Math.round((1 - p.price / p.salePrice) * 100)}% off</div>}
              </div>
              <div className="product-card-action">
                <button className="product-card-btn" onClick={() => addToCart(p, 1)}>
                  <svg><use href="#i-cart" /></svg> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
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

"""

code = code[:shop_start] + new_shop + code[shop_end:]

# Now modify Storefront to fetch products and pass them
code = code.replace("export default function Storefront() {", """import { productApi } from '../lib/api'

export default function Storefront() {""")

code = code.replace("const [cart, setCart] = useState<any[]>([])", """const [cart, setCart] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])""")

effect_code = """  useEffect(() => {
    productApi.getAll().then(res => setProducts(res.products || [])).catch(console.error)
  }, [])
"""

code = code.replace("useEffect(() => {", effect_code + "\n  useEffect(() => {")

# Update ShopPage call
code = code.replace("{activeTab === 'shop' && <ShopPage setActiveTab={setActiveTab} />}", "{activeTab === 'shop' && <ShopPage setActiveTab={setActiveTab} products={products} addToCart={addToCart} />}")

# Update setActiveTab to handle product
code = code.replace("const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product'>('home')", """
  const [activeTab, _setActiveTab] = useState<'home' | 'shop' | 'product'>('home')
  const setActiveTab = (tab: 'home'|'shop'|'product', product?: any) => {
    _setActiveTab(tab)
    if (product) setSelectedProduct(product)
  }
""")

# Replace activeTab variable in renders
code = code.replace("activeTab={activeTab}", "activeTab={activeTab}") # Just ensuring it matches

# Update Footer inclusion to include Mobile Nav
code = code.replace("<Footer />", "<Footer />\n      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} setShowCart={setShowCart} />")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Updated storefront.tsx with mobile UI and dynamic products")
