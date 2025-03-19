const Booking = require('../../models/Booking Management/BookingModel');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        // Validate that seatNumbers is an array and not empty
        if (!Array.isArray(req.body.seatNumbers) || req.body.seatNumbers.length === 0) {
            return res.status(400).json({ message: 'At least one seat must be selected' });
        }

        const booking = new Booking(req.body);
        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get booked seats for a specific movie, date, and time
exports.getBookedSeats = async (req, res) => {
    try {
        const { movieId, date, time } = req.query;
        
        if (!date || !time) {
            return res.status(400).json({ message: 'Date and time are required' });
        }

        const bookings = await Booking.find({
            movieDate: date,
            movieTime: time
        });

        // Extract all booked seat numbers into a single array
        const bookedSeats = bookings.reduce((acc, booking) => {
            return acc.concat(booking.seatNumbers);
        }, []);

        res.status(200).json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Validate seatNumbers if provided
        if (req.body.seatNumbers && (!Array.isArray(req.body.seatNumbers) || req.body.seatNumbers.length === 0)) {
            return res.status(400).json({ message: 'At least one seat must be selected' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
