require('dotenv').config(); 
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const statesRouter = require('./routes/api/states');
const rootRouter = require('./routes/root');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route to handle states requests
app.use('/states', statesRouter);
app.use('/', rootRouter);

// 404 Error handling
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Start the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
