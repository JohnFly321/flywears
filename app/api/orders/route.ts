import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

type OrderItemInput = {
  id: string;
  quantity?: number;
  price: number;
};

// ==========================================
// 1. CREATE A NEW ORDER (POST) - WITH PAYSTACK VERIFICATION
// ==========================================
export async function POST(request: Request) {
  try {
    console.log('🔄 Creating order...');
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, deliveryAddress, phoneNumber, paymentReference } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // 1. SECURITY CHECK: Verify the payment with Paystack directly
    if (!paymentReference) {
      return NextResponse.json({ error: 'Payment reference is missing' }, { status: 400 });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status !== true) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Check if the amount paid matches the total amount (Paystack returns amount in kobo)
    if (verifyData.data.amount !== totalAmount * 100) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // 2. Ensure user exists in database
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: `${userId}@flywears.com`,
        name: 'FlyWears User',
        role: 'buyer',
      },
    });

    // 3. Create the order (Now we know it's 100% verified and paid!)
    const order = await prisma.order.create({
      data: {
        user: {
          connect: { clerkId: userId }
        },
        totalAmount,
        deliveryAddress: deliveryAddress || "No address provided",
        phoneNumber: phoneNumber || "No phone provided",
        status: 'PROCESSING', // Changed to PROCESSING since payment is verified
        paymentReference: paymentReference, // Save the reference for your records
        items: {
          create: items.map((item: OrderItemInput) => ({
            productId: item.id,
            quantity: item.quantity || 1,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('✅ Order created and verified successfully:', order.id);
    return NextResponse.json({ success: true, order }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ ERROR CREATING ORDER:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

// ==========================================
// 2. GET USER'S ORDERS (GET)
// ==========================================
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        user: {
          clerkId: userId
        }
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}