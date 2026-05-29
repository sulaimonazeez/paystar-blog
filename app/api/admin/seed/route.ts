import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';

// ONE-TIME USE: Creates the first admin account
// DELETE or disable this route after first use for security
export async function POST() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD in .env' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db.collection('admins').findOne({ email: email.toLowerCase() });

    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.collection('admins').insertOne({
      name,
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: `Admin "${name}" created. Delete this route now!` });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
