import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed FlyWears database...');

  // Create a test seller user
  const seller = await prisma.user.upsert({
    where: { clerkId: 'test-seller-001' },
    update: {},
    create: {
      clerkId: 'test-seller-001',
      email: 'seller@flywears.com',
      name: 'FlyWears Official Store',
      role: 'seller',
    },
  });

  console.log('✅ Created test seller');

  // Define all 6 products
  const products = [
    {
      name: 'Classic Leather Bag',
      price: 45000,
      description: 'Premium handcrafted leather bag with spacious interior and elegant design. Perfect for both casual and formal occasions.',
      category: 'Bags',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      ],
      sizes: ['Small', 'Medium', 'Large'],
    },
    {
      name: 'Premium Running Shoes',
      price: 65000,
      description: 'Lightweight and durable running shoes designed for maximum comfort and performance. Features advanced cushioning technology.',
      category: 'Shoes',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      ],
      sizes: ['40', '41', '42', '43', '44', '45'],
    },
    {
      name: 'Designer Jacket',
      price: 95000,
      description: 'Stylish designer jacket made from premium materials. Features a modern cut and versatile design suitable for any season.',
      category: 'Clothes',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Minimalist Backpack',
      price: 35000,
      description: 'Sleek and functional minimalist backpack. Perfect for daily commute, school, or travel with multiple compartments.',
      category: 'Bags',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800',
      ],
      sizes: ['One Size'],
    },
    {
      name: 'Casual Sneakers',
      price: 45000,
      description: 'Comfortable casual sneakers for everyday wear. Features a breathable upper and flexible sole for all-day comfort.',
      category: 'Shoes',
      images: [
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
        'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800',
      ],
      sizes: ['39', '40', '41', '42', '43', '44'],
    },
    {
      name: 'Cotton T-Shirt',
      price: 15000,
      description: 'Soft, breathable 100% cotton t-shirt. Features a classic fit and durable fabric that maintains its shape wash after wash.',
      category: 'Clothes',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
  ];

  // Insert all products
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: seller.id,
      },
    });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log('🎉 Seeding completed successfully!');
  console.log(`📦 Total products created: ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });