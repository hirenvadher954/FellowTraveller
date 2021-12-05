const express = require('express');
const connectDB = require('./config/db');
const app = express();

// * Connect Database
connectDB();

// * Init Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => res.send('API running'));

// * Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/profile/:id', require('./routes/api/profile'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})

