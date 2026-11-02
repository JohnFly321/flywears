import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params;  // Await the params
    
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}