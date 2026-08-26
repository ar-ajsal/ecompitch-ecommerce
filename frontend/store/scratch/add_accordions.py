import re

file_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\components\storefront.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Inject the Accordion Component near the top of the file, after the imports
accordion_component = """
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
"""

if "const Accordion" not in code:
    code = code.replace("const Icons = () => (", accordion_component + "\nconst Icons = () => (")

# 2. Replace the specs section with the accordions
specs_start = code.find('<section className="specs">')
specs_end = code.find('<section className="pullquote">')

if specs_start != -1 and specs_end != -1:
    new_accordions = """{/*  PRODUCT DETAILS ACCORDIONS  */}
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
  
  """
    code = code[:specs_start] + new_accordions + code[specs_end:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully replaced specs with accordions!")
else:
    print("Could not find specs block")
