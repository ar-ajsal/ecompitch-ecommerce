import os

css_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\app\globals.css"

new_css = """
/* ============================================================================
   MOBILE-FIRST E-COMMERCE ADDITIONS (Flipkart/Myntra style)
   ============================================================================ */

/* ---- Mobile Bottom Navigation ---- */
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 800px) {
  /* Hide standard header on mobile if desired, or just simplify it */
  .nav-menu { display: none; }
  .nav-tools { display: none; }
  
  body {
    padding-bottom: 70px; /* Space for bottom nav */
  }

  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--surface);
    border-top: 1px solid var(--line);
    z-index: 100;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  }

  .mobile-bottom-nav .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--ink-2);
    font-size: 10px;
    font-weight: 500;
    flex: 1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .mobile-bottom-nav .nav-item.active {
    color: var(--lime-ink); /* Or standard active color */
  }
  
  .mobile-bottom-nav .nav-item svg {
    width: 22px;
    height: 22px;
    stroke-width: 1.8px;
  }
  
  .mobile-bottom-nav .nav-item.active svg {
    stroke: var(--lime-ink);
    fill: var(--lime-glow);
  }
  
  /* Sticky Product Action Bar */
  .pdp-sticky-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--surface);
    padding: 10px 16px;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
    z-index: 101;
    gap: 12px;
  }
  
  .pdp-sticky-bar .btn {
    flex: 1;
    height: 48px;
    font-size: 15px;
    border-radius: 8px;
  }
  
  .pdp-sticky-bar .btn-dark {
    background: var(--ink);
    color: var(--surface);
  }
  
  .pdp-sticky-bar .btn-accent {
    background: var(--lime);
    color: var(--lime-ink);
  }
}

/* ---- Sales-Oriented Product Cards ---- */
.product-card {
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-2);
}

.product-card-img-wrap {
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card-img-wrap img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.product-card-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-card-brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--ink-2);
  font-weight: 600;
}

.product-card-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-2);
}

.product-card-rating svg {
  width: 14px;
  height: 14px;
  color: #fbbf24; /* Yellow star */
}

.product-card-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.product-card-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
}

.product-card-original-price {
  font-size: 13px;
  text-decoration: line-through;
  color: var(--muted);
}

.product-card-discount {
  font-size: 11px;
  font-weight: 700;
  color: #16a34a; /* Green discount */
}

.product-card-action {
  margin-top: 12px;
}

.product-card-btn {
  width: 100%;
  height: 40px;
  border-radius: var(--r-xs);
  background: var(--bg);
  color: var(--ink);
  font-weight: 600;
  font-size: 14px;
  border: 1px solid var(--line);
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.product-card-btn:hover {
  background: var(--ink);
  color: var(--surface);
}

.product-card-btn svg {
  width: 16px;
  height: 16px;
}

/* Grid for Mobile & Desktop */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  padding: 24px 0;
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px 0;
  }
  
  .product-card-details {
    padding: 12px;
  }
  
  .product-card-title {
    font-size: 13px;
  }
  
  .product-card-price {
    font-size: 16px;
  }
  
  .product-card-original-price,
  .product-card-discount {
    font-size: 10px;
  }
  
  .product-card-btn {
    height: 36px;
    font-size: 13px;
  }
}

/* Simplify PDP for mobile */
@media (max-width: 800px) {
  .hero-plate {
    margin: 0;
    border-radius: 0;
    border: none;
  }
  
  .product-detail-container {
    padding-bottom: 80px; /* Space for sticky bar */
  }
  
  /* Hide standard buy buttons if sticky bar is active */
  .pdp-desktop-buy {
    display: none;
  }
}
"""

with open(css_path, "a", encoding="utf-8") as f:
    f.write("\n" + new_css)

print("Appended mobile and sales UI CSS to globals.css")
