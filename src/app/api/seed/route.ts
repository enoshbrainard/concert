
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';
import Booking from '@/models/Booking'; // Import to clear bookings too
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing data
        await Event.deleteMany({});
        await User.deleteMany({});
        await Booking.deleteMany({});

        // Create Admin User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        // Create Normal User
        const normalUser = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: hashedPassword,
            role: 'user',
        });

        // Create Events
        const events = [
            {
                title: 'Neon Nights Concert',
                description: 'Experience an electrifying night of synthwave and electronic music under the neon lights. A visual and auditory masterpiece.',
                date: new Date('2024-12-15T20:00:00'),
                location: 'Cyber Arena, Downtown',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1459749411177-712961561f1c?q=80&w=2070&auto=format&fit=crop',
                availableSeats: 100,
            },
            {
                title: 'Tech Innovators Summit',
                description: 'Join the brightest minds in technology for a day of inspiring talks, networking, and future-gazing.',
                date: new Date('2024-11-20T09:00:00'),
                location: 'Convention Center, Bay Area',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop',
                availableSeats: 500,
            },
            {
                title: 'Summer Vibes Festival',
                description: 'Three days of music, art, and food in the heart of the city. Featuring top indie bands and local artists.',
                date: new Date('2024-07-10T12:00:00'),
                location: 'Central Park',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop',
                availableSeats: 2000,
            },
            {
                title: 'Classical Symphony Gala',
                description: 'A black-tie evening featuring the Philharmonic Orchestra performing masterpieces by Beethoven and Mozart.',
                date: new Date('2024-10-05T19:30:00'),
                location: 'Grand Opera House',
                price: 120.00,
                image: 'https://images.unsplash.com/photo-1465847899078-b413929f7120?q=80&w=2070&auto=format&fit=crop',
                availableSeats: 800,
            },
            {
                title: 'Comedy Night Special',
                description: 'Laugh explicitly loud with some of the best stand-up comedians in the country.',
                date: new Date('2024-09-12T21:00:00'),
                location: 'The Laugh Factory',
                price: 35.00,
                image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedec2?q=80&w=2070&auto=format&fit=crop',
                availableSeats: 150,
            },
            {
                title: 'Art & Wine Exhibition',
                description: 'Explore contemporary art while enjoying a curated selection of fine wines.',
                date: new Date('2024-08-25T18:00:00'),
                location: 'Modern Art Gallery',
                price: 25.00,
                image: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?q=80&w=1974&auto=format&fit=crop',
                availableSeats: 300,
            },
        ];

        await Event.insertMany(events);

        return NextResponse.json({ message: 'Database seeded successfully', admin: 'admin@example.com', user: 'user@example.com' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
