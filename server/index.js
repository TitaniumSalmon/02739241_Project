// API Part

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // Ensure you're using mysql2/promise
const cors = require('cors');
const app = express();

const port = 8000;
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

let conn = null;


// Initialize MySQL connection
const initMYSQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8820,
    });
};


// test
/*
app.get("/messages", (req, res) => {
    res.send("Hello");
});

app.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});
*/

/* Index 
Get
Post
Put
Delete
*/

app.get('/setSession', (req, res) => {
    console.log('req.session',req.session);
    req.session.user = 'John Doe';
    res.send('Session set');
});
app.get('/getSession', (req, res) => {
    if (req.session.user) {
        res.send(`Hello ${req.session.user.name}`);
    } else {
        res.send('No session found');
    }
}
);
app.get('/clearSession', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error clearing session');
        }
        res.send('Session cleared');
    });
}
);

app.get('/rooms', async (req, res) => {
    try {
        const [results] = await conn.execute('SELECT * FROM Rooms');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/room_type', async (req, res) => {
    try {
        const [results] = await conn.execute('SELECT * FROM Room_Types');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/users', async (req, res) => {
    try {
        const [results] = await conn.execute('SELECT * FROM Users');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}
);



app.post('/users', async (req, res) => {
    let user = req.body;
    
    if (user == "undefined") {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const results = await conn.query('INSERT INTO Users SET ?', user);

        res.json({
            message: 'User created successfully',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;

    if (updateUser == "undefined") {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const results = await conn.query('UPDATE Users SET ? WHERE user_id = ?', [updateUser, id]);

        res.json({
            message: 'User updated successfully',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete('/users/:id', async (req, res) => {

    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM Users WHERE user_id = ?', [id]);

        res.json({
            message: 'User deleted successfully',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/login', async (req, res) => {
    console.log("73");
    console.log('req.body', req.body);
    
    try {
        const { username, PASSWORD } = req.body[0]; // Extract user details

        const [results] = await conn.execute(
            'SELECT * FROM Users WHERE username = ? AND PASSWORD = ?',
            [
                username, 
                PASSWORD
            ]
        );

        req.session.user_id = results[0].user_id;

        if (results.length > 0) {
            req.session.user = results[0].username; // Store username in session
            console.log('User logged in:', req.session.user);
            res.json({ success: true, user: results[0].username });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
});

app.delete('/rooms/:id', async (req, res) => {
    try {
        const roomId = req.params.id;
        const [results] = await conn.execute('DELETE FROM Rooms WHERE room_id = ?', [roomId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Room deleted successfully' });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Create a new room reservation
app.post('/reservations', async (req, res) => {
    const reservation = req.body;

    if (!reservation.user_id || !reservation.room_id || !reservation.reservation_date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [results] = await conn.execute(
            'INSERT INTO Room_Reservations (user_id, room_id, reservation_date, status, payment_status) VALUES (?, ?, ?, ?, ?)',
            [reservation.user_id, reservation.room_id, reservation.reservation_date, 'pending', 'pending']
        );

        res.json({
            message: 'Reservation created successfully',
            reservation_id: results.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get all room reservations
app.get('/reservations', async (req, res) => {
    try {
        const [results] = await conn.execute('SELECT * FROM Room_Reservations');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get a specific room reservation by ID
app.get('/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        const [results] = await conn.execute('SELECT * FROM Room_Reservations WHERE reservation_id = ?', [reservationId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update a room reservation
app.put('/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;
    const updateData = req.body;

    try {
        const [results] = await conn.execute(
            'UPDATE Room_Reservations SET ? WHERE reservation_id = ?',
            [updateData, reservationId]
        );

        if (results.affectedRows > 0) {
            res.json({ message: 'Reservation updated successfully' });
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Delete a room reservation
app.delete('/reservations/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        const [results] = await conn.execute('DELETE FROM Room_Reservations WHERE reservation_id = ?', [reservationId]);
        if (results.affectedRows > 0) {
            res.json({ message: 'Reservation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(port, async () => {
    await initMYSQL();
    console.log('Http Server is running on port ' + port);
});


