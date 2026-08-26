import os, re

base_dir = r"c:\Users\User\OneDrive\Desktop\barter-1\9b36af76_ui"
out_file = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\components\storefront.tsx"

def get_body(filename):
    path = os.path.join(base_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
        body_match = re.search(r"<body>(.*?)</body>", html, re.DOTALL)
        if body_match:
            body = body_match.group(1)
            # Remove scripts if any
            body = re.sub(r"<script.*?>.*?</script>", "", body, flags=re.DOTALL)
            return body
        return html

def to_jsx(html_str):
    # class to className
    jsx = html_str.replace('class="', 'className="')
    # style to object
    # self-closing tags
    jsx = re.sub(r'<(img|hr|br|input|source)([^>]*)>', r'<\1\2 />', jsx)
    jsx = jsx.replace('/>>', '/>')
    jsx = jsx.replace(' />>', '/>')
    # replace comments (<!-- --> to {/* */})
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)
    # stroke-width to strokeWidth
    jsx = jsx.replace('stroke-width', 'strokeWidth')
    jsx = jsx.replace('stroke-linecap', 'strokeLinecap')
    jsx = jsx.replace('stroke-linejoin', 'strokeLinejoin')
    jsx = jsx.replace('fill-rule', 'fillRule')
    jsx = jsx.replace('clip-rule', 'clipRule')
    # style="position:absolute" -> style={{position: 'absolute'}}
    # convert style="key:val; key:val" to style={{key: "val", key: "val"}}
    def style_replacer(match):
        css = match.group(1)
        pairs = css.split(';')
        react_style = []
        for pair in pairs:
            if not ':' in pair: continue
            k, v = pair.split(':', 1)
            k = k.strip()
            v = v.strip()
            # camelCase conversion
            k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            react_style.append(f'{k}: "{v}"')
        return "style={{" + ", ".join(react_style) + "}}"
    
    jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)
    
    return jsx

index_html = get_body("index.html")
shop_html = get_body("shop.html")
product_html = get_body("product.html")

# Extract the header/footer from index.html
icons = re.search(r'<svg width="0" height="0" style=\{\{position: "absolute"\}\} aria-hidden="true">.*?</svg>', to_jsx(index_html), re.DOTALL).group(0)
icons = re.search(r'<svg width="0" height="0" style=\{\{position: "absolute"\}\} aria-hidden="true">.*?</svg>', to_jsx(index_html), re.DOTALL).group(0)
ticker = re.search(r'<div className="ticker">.*?</div>', to_jsx(index_html), re.DOTALL).group(0)
header_nav = re.search(r'<header className="nav">.*?</header>', to_jsx(index_html), re.DOTALL).group(0)
footer = re.search(r'<footer.*?>.*?</footer>', to_jsx(index_html), re.DOTALL)
footer = footer.group(0) if footer else ""

# The rest of index.html is the main content
main_match = re.search(r'<main>(.*?)</main>', to_jsx(index_html), re.DOTALL)
homepage_content = main_match.group(1) if main_match else ""

# Extract shop content
shop_main = re.search(r'<main>(.*?)</main>', to_jsx(shop_html), re.DOTALL)
shop_content = shop_main.group(1) if shop_main else ""

# Extract product content
product_main = re.search(r'<main>(.*?)</main>', to_jsx(product_html), re.DOTALL)
product_content = product_main.group(1) if product_main else ""

# Pre-process content for dynamic Links
homepage_content = homepage_content.replace('href="shop.html"', 'href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shop"); }}')
homepage_content = homepage_content.replace('href="product.html"', 'href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }}')
shop_content = shop_content.replace('href="product.html"', 'href="#" onClick={(e) => { e.preventDefault(); setActiveTab("product"); }}')

storefront_tsx_content = f"""'use client'

import React, {{ useState, useEffect }} from 'react'

const Icons = () => (
  <div style={{{{ display: 'none' }}}}>
    {icons}
  </div>
)

const Header = ({{ activeTab, setActiveTab, cart, setShowCart }}: any) => (
  <>
    {ticker}
    <header className="nav">
      <div className="wrap nav-in">
        <button className="nav-burger icon-btn" aria-label="Open menu">
          <svg><use href="#i-menu"/></svg>
        </button>
        <a className="brand" href="#" onClick={{(e) => {{ e.preventDefault(); setActiveTab('home'); }}}} aria-label="ecompitch home">
          ecompitch<span className="spark"></span>
        </a>
        <nav className="nav-menu" aria-label="Primary">
          <a href="#" onClick={{(e) => {{ e.preventDefault(); setActiveTab('shop'); }}}}>Shop</a>
          <a href="#" onClick={{(e) => {{ e.preventDefault(); setActiveTab('shop'); }}}}>Categories</a>
          <a href="#" onClick={{(e) => {{ e.preventDefault(); setActiveTab('shop'); }}}}>New Arrivals</a>
          <a href="#" onClick={{(e) => {{ e.preventDefault(); setActiveTab('home'); }}}}>About</a>
        </nav>
        <div className="nav-tools">
          <button className="nav-search" aria-label="Search products">
            <svg><use href="#i-search"/></svg><span className="ph">Search ecompitch</span><kbd>/</kbd>
          </button>
          <button className="icon-btn" aria-label="Account"><svg><use href="#i-user"/></svg></button>
          <a className="icon-btn cart-link" href="#" onClick={{(e) => {{ e.preventDefault(); setShowCart(true); }}}} aria-label="Cart">
            <svg><use href="#i-cart"/></svg>
            <span className="cart-count">{{cart.reduce((total: number, item: any) => total + item.quantity, 0)}}</span>
          </a>
        </div>
      </div>
    </header>
  </>
)

const Footer = () => (
  {footer}
)

const Homepage = ({{ setActiveTab }}: any) => (
  <main>
    {homepage_content}
  </main>
)

const ShopPage = ({{ setActiveTab }}: any) => (
  <main>
    {shop_content}
  </main>
)

export default function Storefront() {{
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'product'>('home')
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  useEffect(() => {{
    const savedCart = localStorage.getItem('ecompitch_cart')
    if (savedCart) {{
      try {{
        setCart(JSON.parse(savedCart))
      }} catch (e) {{}}
    }}
  }}, [])

  const addToCart = (product: any, quantity: number) => {{
    const newCart = [...cart]
    const existing = newCart.find(i => i.id === product.id)
    if (existing) {{
      existing.quantity += quantity
    }} else {{
      newCart.push({{ ...product, quantity }})
    }}
    setCart(newCart)
    localStorage.setItem('ecompitch_cart', JSON.stringify(newCart))
    setShowCart(true)
  }}

  return (
    <>
      <Icons />
      <Header activeTab={{activeTab}} setActiveTab={{setActiveTab}} cart={{cart}} setShowCart={{setShowCart}} />
      {{activeTab === 'home' && <Homepage setActiveTab={{setActiveTab}} />}}
      {{activeTab === 'shop' && <ShopPage setActiveTab={{setActiveTab}} />}}
      {{activeTab === 'product' && <main dangerouslySetInnerHTML={{{{__html: `{product_content.replace('`', '\\\\`')}`}}}} />}}
      <Footer />
    </>
  )
}}
"""

with open(out_file, "w", encoding="utf-8") as f:
    f.write(storefront_tsx_content)

print("Rewrote storefront.tsx successfully!")
