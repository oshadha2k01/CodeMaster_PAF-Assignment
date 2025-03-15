const Booking = require('../models/BookingModel');

// Add Booking
exports.addBooking = async (req, res, next) => {
    const { movieName, movieDate, movieTime, seatNumber, name, email, phone } = req.body;
    try {
        const newBooking = new Booking({
            movieName,
            movieDate,
            movieTime,
            seatNumber,
            name,
            email,
            phone
        });
        await newBooking.save();
        res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } catch (error) {
        next(error); // Pass error to middleware
    }
};

// Read All Bookings (Admin View)
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

// Read Single Booking by ID (User View)
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};

// Edit Booking
exports.updateBooking = async (req, res, next) => {
    const { movieName, movieDate, movieTime, seatNumber, name, email, phone } = req.body;
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { movieName, movieDate, movieTime, seatNumber, name, email, phone },
            { new: true }
        );
        if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        next(error);
    }
};

// Delete Booking
exports.deleteBooking = async (req, res, next) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        next(error);
    }
};