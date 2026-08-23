require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  await connectDB();

  console.log('\n🌱 Starting database seed...\n');

  // --- Seed Admin User ---
  const existingAdmin = await User.findOne({ email: 'admin@bharatbazaar.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: 'admin@bharatbazaar.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@bharatbazaar.com / Admin@1234');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // --- Seed Sample Products ---
  const existingProducts = await Product.countDocuments();
  if (existingProducts === 0) {
    const sampleProducts = [
      {
        name: 'Lyrix Smartwatch',
        sku: 'TW-WATCH-001',
        brand: 'Lyrix',
        category: 'Gear',
        description: 'A precise everyday smartwatch with a bright, always-on display. Tracks fitness, notifications, and more.',
        price: 34999,
        salePrice: 29999,
        stock: 45,
        reorderLevel: 10,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
            publicId: 'barter-products/lyrix-watch',
          },
        ],
        sold: 128,
        tags: ['smartwatch', 'wearable', 'fitness'],
      },
      {
        name: 'Premium Wireless Earbuds',
        sku: 'TW-EARBUDS-001',
        brand: 'SoundCore',
        category: 'Gear',
        description: 'Immersive sound, adaptive noise cancellation and a pocket-sized case. Up to 30 hours total battery life.',
        price: 38999,
        salePrice: null,
        stock: 32,
        reorderLevel: 8,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            publicId: 'barter-products/earbuds',
          },
        ],
        sold: 89,
        tags: ['earbuds', 'wireless', 'audio', 'anc'],
      },
      {
        name: 'Studio Headphones 21-Bass',
        sku: 'TW-HP-001',
        brand: 'Aural',
        category: 'Gear',
        description: 'Studio-grade bass and all-day comfort in a considered silhouette. Professional audio quality for everyday listening.',
        price: 49999,
        salePrice: 44999,
        stock: 18,
        reorderLevel: 5,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop',
            publicId: 'barter-products/headphones',
          },
        ],
        sold: 67,
        tags: ['headphones', 'studio', 'audio', 'bass'],
      },
      {
        name: 'VR Headset Pro',
        sku: 'TW-VR-001',
        brand: 'VisionTech',
        category: 'Technology',
        description: 'A lighter way to step into expansive new worlds. 4K display, 120Hz refresh rate, and 6DOF tracking.',
        price: 54999,
        salePrice: null,
        stock: 12,
        reorderLevel: 3,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            publicId: 'barter-products/vr-headset',
          },
        ],
        sold: 34,
        tags: ['vr', 'virtual reality', 'gaming'],
      },
      {
        name: 'Universal Phone Charging Dock',
        sku: 'TW-DOCK-001',
        brand: 'Volt',
        category: 'Accessory',
        description: 'One elegant dock for your phone, watch and everyday essentials. Fast charging up to 65W.',
        price: 19999,
        salePrice: 15999,
        stock: 67,
        reorderLevel: 15,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop',
            publicId: 'barter-products/charger',
          },
        ],
        sold: 214,
        tags: ['charger', 'dock', 'fast charging', 'accessory'],
      },
      {
        name: 'Smart Air Purifier',
        sku: 'TW-AP-001',
        brand: 'CleanAir',
        category: 'Technology',
        description: 'Quiet, compact and designed to make your space feel better. True HEPA filter captures 99.97% of particles.',
        price: 28999,
        salePrice: null,
        stock: 24,
        reorderLevel: 5,
        status: 'Active',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
            publicId: 'barter-products/air-purifier',
          },
        ],
        sold: 56,
        tags: ['air purifier', 'smart home', 'health'],
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} sample products created`);
  } else {
    console.log(`ℹ️  ${existingProducts} products already exist, skipping product seed.`);
  }

  console.log('\n✅ Seed complete!\n');
  console.log('Admin credentials:');
  console.log('  Email:    admin@bharatbazaar.com');
  console.log('  Password: Admin@1234');
  console.log('\nStart the server: npm run dev\n');

  await mongoose.connection.close();
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});
