import re

with open('frontend/admin/components/dashboard/dashboard-shell.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import Pencil
content = content.replace(
    'Plus, Search, Sun, Trash2, Upload, X,',
    'Plus, Search, Sun, Trash2, Upload, X, Pencil,'
)

# 2. ProductTable declaration
content = content.replace(
    'function ProductTable({ store, products, onDelete, compact = false }: {',
    'function ProductTable({ store, products, onDelete, onEdit, compact = false }: {'
)
content = content.replace(
    '  onDelete?: (id: string) => void\n  compact?: boolean\n}) {',
    '  onDelete?: (id: string) => void\n  onEdit?: (product: ApiProduct) => void\n  compact?: boolean\n}) {'
)

# 3. ProductTable Actions Header
content = content.replace(
    '{!compact && onDelete && <th className="pb-3 text-right font-medium">Actions</th>}',
    '{!compact && (onDelete || onEdit) && <th className="pb-3 text-right font-medium">Actions</th>}'
)

# 4. ProductTable Edit Button
content = content.replace(
    """              {!compact && onDelete && (
                <td className="py-3 text-right">
                  <button""",
    """              {!compact && (onDelete || onEdit) && (
                <td className="py-3 text-right">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors mr-2"
                      aria-label="Edit product"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {onDelete && (
                    <button"""
)
content = content.replace(
    """                      <Trash2 size={14} />
                    </button>
                </td>
              )}""",
    """                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              )}"""
)


# 5. ModuleView declaration
content = content.replace(
    'function ModuleView({ active, store, onToast, products, orders, onProductDelete, onOrderStatusChange, onAddProduct }: {',
    'function ModuleView({ active, store, onToast, products, orders, onProductDelete, onProductEdit, onOrderStatusChange, onAddProduct }: {'
)
content = content.replace(
    '  onProductDelete: (id: string) => void\n  onOrderStatusChange: (id: string, st: string) => void\n  onAddProduct: () => void\n}) {',
    '  onProductDelete: (id: string) => void\n  onProductEdit: (product: ApiProduct) => void\n  onOrderStatusChange: (id: string, st: string) => void\n  onAddProduct: () => void\n}) {'
)

# 6. ModuleView ProductTable rendering
content = content.replace(
    '<ProductTable store={store} products={filteredProducts} onDelete={onProductDelete} />',
    '<ProductTable store={store} products={filteredProducts} onDelete={onProductDelete} onEdit={onProductEdit} />'
)


# 7. ProductForm declaration and logic
content = content.replace(
    'function ProductForm({ onToast, onSaved }: { onToast: (message: string) => void; onSaved: () => void }) {',
    'function ProductForm({ onToast, onSaved, productToEdit }: { onToast: (message: string) => void; onSaved: () => void; productToEdit?: ApiProduct | null }) {'
)
content = content.replace(
    """  const [form, setForm] = useState({
    name: '', sku: '', brand: '', category: 'Accessories',
    description: '', price: '', salePrice: '', stock: '', reorderLevel: '12',
    status: 'Active',
  })""",
    """  const [form, setForm] = useState({
    name: '', sku: '', brand: '', category: 'Accessories',
    description: '', price: '', salePrice: '', stock: '', reorderLevel: '12',
    status: 'Active',
  })

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name,
        sku: productToEdit.sku || '',
        brand: productToEdit.brand || '',
        category: productToEdit.category,
        description: productToEdit.description || '',
        price: String(productToEdit.price),
        salePrice: productToEdit.salePrice ? String(productToEdit.salePrice) : '',
        stock: String(productToEdit.stock),
        reorderLevel: String(productToEdit.reorderLevel || 12),
        status: productToEdit.status,
      })
      setImages(productToEdit.images || [])
      if (productToEdit.specifications?.length) setSpecs(productToEdit.specifications)
      if (productToEdit.variants?.length) setVariants(productToEdit.variants)
    }
  }, [productToEdit])"""
)

old_submit = """    try {
      await productApi.create({
        ...form,
        status: form.status as 'Active' | 'Draft' | 'Archived',
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock) || 0,
        reorderLevel: Number(form.reorderLevel) || 12,
        images,
        specifications: specs.filter(s => s.name && s.value),
        variants: variants.filter(v => v.name && v.options),
      })
      onToast('✅ Product created successfully!')
      onSaved()
    }"""
new_submit = """    try {
      const data = {
        ...form,
        status: form.status as 'Active' | 'Draft' | 'Archived',
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock) || 0,
        reorderLevel: Number(form.reorderLevel) || 12,
        images,
        specifications: specs.filter(s => s.name && s.value),
        variants: variants.filter(v => v.name && v.options),
      }
      if (productToEdit) {
        await productApi.update(productToEdit._id, data)
        onToast('✅ Product updated successfully!')
      } else {
        await productApi.create(data)
        onToast('✅ Product created successfully!')
      }
      onSaved()
    }"""
content = content.replace(old_submit, new_submit)

content = content.replace(
    '<h2 className="mt-1 text-xl font-semibold tracking-tight">Create product</h2>',
    '<h2 className="mt-1 text-xl font-semibold tracking-tight">{productToEdit ? "Edit product" : "Create product"}</h2>'
)
content = content.replace(
    "{saving ? 'Saving…' : 'Save product'}",
    "{saving ? 'Saving…' : productToEdit ? 'Update product' : 'Save product'}"
)

# 8. DashboardShell state and logic
content = content.replace(
    'const [showProductForm, setShowProductForm] = useState(false)',
    'const [showProductForm, setShowProductForm] = useState(false)\n  const [productToEdit, setProductToEdit] = useState<ApiProduct | null>(null)'
)
content = content.replace(
    '{showProductForm ? \'Create product\' : active}',
    '{showProductForm ? (productToEdit ? \'Edit product\' : \'Create product\') : active}'
)
content = content.replace(
    'onAddProduct={() => setShowProductForm(true)}',
    'onAddProduct={() => { setProductToEdit(null); setShowProductForm(true); }}'
)

# Update ModuleView call in DashboardShell
content = content.replace(
    '          <ModuleView\n            active={active}\n            store={store}\n            onToast={setToast}\n            orders={orders}\n            onOrderStatusChange={handleOrderStatusChange}\n            products={products}\n            onProductDelete={handleProductDelete}\n            onAddProduct={() => setShowProductForm(true)}\n          />',
    '          <ModuleView\n            active={active}\n            store={store}\n            onToast={setToast}\n            orders={orders}\n            onOrderStatusChange={handleOrderStatusChange}\n            products={products}\n            onProductDelete={handleProductDelete}\n            onProductEdit={(p) => { setProductToEdit(p); setShowProductForm(true); }}\n            onAddProduct={() => { setProductToEdit(null); setShowProductForm(true); }}\n          />'
)

# Update ProductForm call in DashboardShell
content = content.replace(
    '{active === \'Add Product\' && <ProductForm onToast={setToast} onSaved={() => { setActive(\'Products\'); loadProducts() }} />}',
    '{active === \'Add Product\' && <ProductForm productToEdit={productToEdit} onToast={setToast} onSaved={() => { setActive(\'Products\'); loadProducts() }} />}'
)
content = content.replace(
    '{showProductForm && active !== \'Add Product\' && <ProductForm onToast={setToast} onSaved={() => { setShowProductForm(false); loadProducts() }} />}',
    '{showProductForm && active !== \'Add Product\' && <ProductForm productToEdit={productToEdit} onToast={setToast} onSaved={() => { setShowProductForm(false); loadProducts() }} />}'
)


with open('frontend/admin/components/dashboard/dashboard-shell.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched successfully")
