import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// ==========================================
// POST: Create a new product (Seller Dashboard)
// ==========================================
export async function POST(request: Request) {
  try {
    // 1. Check if user is logged in
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to sell.' }, { status: 401 });
    }

    // 2. Get data from the frontend form
    const body = await request.json();
    const { name, price, description, category, images, sizes } = body;

    // 3. Basic validation
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Please fill in Name, Price, and Category.' }, { status: 400 });
    }

    // 4. Safely format the images and sizes into arrays
    const imageArray = typeof images === 'string' 
      ? images.split(',').map((url: string) => url.trim()).filter(url => url.length > 0) 
      : ['https://via.placeholder.com/500'];
      
    const sizeArray = typeof sizes === 'string' 
      ? sizes.split(',').map((s: string) => s.trim()).filter(s => s.length > 0) 
      : ['One Size'];

    // 5. Find or create the user in our database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: `${userId}@flywears.com`, 
        name: 'FlyWears Seller',
        role: 'seller',
      },
    });

    // 6. Save the product to MongoDB
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseInt(price), 
        description: description || 'No description provided.',
        category,
        images: imageArray,
        sizes: sizeArray,
        sellerId: dbUser.id,
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    
  } catch (error: any) {
    console.error("DATABASE ERROR DETAILS:", error);
    return NextResponse.json({ error: error.message || 'Unknown database error' }, { status: 500 });
  }
}

// ==========================================
// GET: Fetch products for the Homepage
// ==========================================
// ==========================================
// GET: Fetch products for the Homepage & Shop
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search'); // NEW: Get search term

    // Build the filter object
    const where: any = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      // Search for products where the name contains the search term (case-insensitive)
      where.name = { 
        contains: search,
        mode: 'insensitive' 
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: true,
      }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}