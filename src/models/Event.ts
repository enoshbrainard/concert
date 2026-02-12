
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this event.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date.'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location.'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price.'],
        min: 0,
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL.'],
    },
    availableSeats: {
        type: Number,
        required: [true, 'Please provide available seats.'],
        min: 0,
    },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
