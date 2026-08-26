import os, re

file_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\components\storefront.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Fix 1: Remove React comments from dangerouslySetInnerHTML that render as text
# Because of multiline, we should just remove them from the entire file where it's part of the raw string.
# Actually, they are inside the __html template literal. We can safely remove all {/* ... */} from the file except if they are needed, but there are no real react comments that are needed.
# Wait, some React comments might be legitimate if they are in the actual React parts.
# Let's target only the activeTab === 'product' block.
prod_start = code.find("{activeTab === 'product' &&")
prod_end = code.find("<Footer />", prod_start)

if prod_start != -1 and prod_end != -1:
    prod_block = code[prod_start:prod_end]
    # Remove {/* ... */}
    clean_prod_block = re.sub(r'\{/\*.*?\*/\}', '', prod_block, flags=re.DOTALL)
    
    # Add Sticky PDP Bar HTML to the bottom of the product detail
    # The sticky bar was specified in CSS as `.pdp-sticky-bar` inside `.mobile-bottom-nav` media query
    sticky_bar = """
    <div className="pdp-sticky-bar mobile-bottom-nav">
      <button className="btn btn-dark" onClick={() => alert('Added to cart')}>Add to Cart</button>
      <button className="btn btn-accent" onClick={() => alert('Buying now')}>Buy Now</button>
    </div>
    """
    
    # Insert right before the closing </main>
    clean_prod_block = clean_prod_block.replace("</main>\\n`", sticky_bar + "\\n</main>\\n`")
    
    code = code[:prod_start] + clean_prod_block + code[prod_end:]

# Fix 2: Add padding to ShopPage so mobile bottom nav doesn't cover the last products
shop_start = code.find("const ShopPage =")
shop_end = code.find("const MobileBottomNav =")
if shop_start != -1 and shop_end != -1:
    shop_block = code[shop_start:shop_end]
    shop_block = shop_block.replace('<main>', '<main style={{ paddingBottom: "80px" }}>')
    code = code[:shop_start] + shop_block + code[shop_end:]

# Fix 3: Also ensure Homepage has padding
home_start = code.find("const Homepage =")
home_end = code.find("const ShopPage =")
if home_start != -1 and home_end != -1:
    home_block = code[home_start:home_end]
    home_block = home_block.replace('<main>', '<main style={{ paddingBottom: "80px" }}>')
    code = code[:home_start] + home_block + code[home_end:]


with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Fixed UI style errors in storefront.tsx")
