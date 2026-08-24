require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

const products = [
  {
    name: 'ecompitch Pro 2 Over-ear ANC',
    sku: 'EC-PRO2-ONX',
    brand: 'ecompitch',
    category: 'Audio',
    description: 'Immersive spatial audio, adaptive noise cancellation, and all-day comfort — in a frame machined to disappear the moment you put it on.',
    price: 29999,
    salePrice: 24999,
    stock: 50,
    status: 'Active',
    images: [
      { url: '/assets/pro2-01.svg', publicId: 'pro2-1' },
      { url: '/assets/pro2-02.svg', publicId: 'pro2-2' },
      { url: '/assets/pro2-03.svg', publicId: 'pro2-3' },
      { url: '/assets/pro2-04.svg', publicId: 'pro2-4' },
    ],
    specifications: [
      { name: 'Driver', value: '40mm bio-cellulose' },
      { name: 'Battery', value: '40hr (ANC on)' },
      { name: 'Connectivity', value: 'Bluetooth 5.4 LE' },
      { name: 'Weight', value: '320g' }
    ]
  },
  {
    name: 'Buds Air 3',
    sku: 'EC-BA3-WHT',
    brand: 'ecompitch',
    category: 'Audio',
    description: 'Spatial audio with dynamic head tracking. Wireless charging case.',
    price: 11999,
    salePrice: 9499,
    stock: 120,
    status: 'Active',
    images: [
      { url: '/assets/buds-air-01.svg', publicId: 'ba3-1' },
      { url: '/assets/buds-air-02.svg', publicId: 'ba3-2' }
    ]
  },
  {
    name: 'Field Speaker',
    sku: 'EC-FS1-BLK',
    brand: 'ecompitch',
    category: 'Audio',
    description: '360° sound, IP67 water and dust resistance, 24-hour battery life.',
    price: 14999,
    salePrice: 12999,
    stock: 35,
    status: 'Active',
    images: [
      { url: '/assets/field-speaker-01.svg', publicId: 'fs-1' }
    ]
  },
  {
    name: 'GaN 100W Charger',
    sku: 'EC-GAN100',
    brand: 'ecompitch',
    category: 'Charging',
    description: 'Dual USB-C ports with 100W total output. Foldable pins.',
    price: 4999,
    salePrice: 3999,
    stock: 200,
    status: 'Active',
    images: [
      { url: '/assets/gan-100w.svg', publicId: 'gan-1' }
    ]
  },
  {
    name: 'Headset RX',
    sku: 'EC-HRX-BLK',
    brand: 'ecompitch',
    category: 'Gaming',
    description: 'Gaming headset with detachable boom mic and spatial audio.',
    price: 10999,
    salePrice: 8999,
    stock: 80,
    status: 'Active',
    images: [
      { url: '/assets/headset-rx.svg', publicId: 'rx-1' }
    ]
  },
  {
    name: 'Lyrix Watch S2',
    sku: 'EC-LYS2-SLV',
    brand: 'Lyrix',
    category: 'Wearables',
    description: 'Always-on AMOLED display, ECG, and blood oxygen monitoring.',
    price: 19999,
    salePrice: 17999,
    stock: 45,
    status: 'Active',
    images: [
      { url: '/assets/watch-s2-01.svg', publicId: 'ws2-1' }
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Seeding new products...');
    await Product.insertMany(products);
    
    console.log('Creating categories...');
    const categories = [...new Set(products.map(p => p.category))];
    for (const catName of categories) {
      await Category.findOneAndUpdate(
        { name: catName },
        { name: catName, description: `${catName} accessories and devices`, featured: true },
        { upsert: true, new: true }
      );
    }
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
