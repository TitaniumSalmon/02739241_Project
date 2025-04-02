// API Part

const express = require('express');
//const session = require('express-session');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // Ensure you're using mysql2/promise
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const oneDay = 1000 * 60 * 60 * 24;
const port = 8000;

// app.use(session({
//     secret: "secrctekeykokdev",
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));
app.use(cookieSession({
    name: 'session',
    keys: ['secret-key1', 'secret-key2'],
    maxAge: oneDay
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(express.static(__dirname));


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

app.post('/lease_contracts', async (req, res) => {
    let lease_contracts = req.body;

    if (lease_contracts == "undefined") {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const results = await conn.query('INSERT INTO Lease_Contracts SET ?', lease_contracts);

        res.json({
            message: 'Lease contract created successfully',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}
);

app.get('/lease_contracts', async (req, res) => {
    let room_no = req.query.room_no;
    console.log('room_no', room_no);
    let sql = 'SELECT * FROM Lease_Contracts';
    let params = [];

    if (room_no) {
        sql += ' WHERE room_id = ?';
        params.push(room_no);
    }

    try {
        const [results] = await conn.execute(sql, params);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



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

app.post('/login', async (req, res) => {
    console.log('req.body', req.body);
    
    try {
        const { username, password } = req.body; // Extract user details
        console.log('username', username);
        console.log('password', password);
        const [results] = await conn.execute(
            'SELECT * FROM Users WHERE username = ? AND PASSWORD = ?',
            [
                username, 
                password
            ]
        );

        req.session.user_id = results[0].user_id;

        if (results.length > 0) {
            req.session.user = results[0].username; // Store username in session
            console.log('User logged in:', req.session.user);
            res.json({ success: true, user: results[0].username, userId: results[0].user_id });
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


app.post('/reservations-with-payment', async (req, res) => {
    console.log(req.body);
    const { user_id, room_id, reservation_date, amount, payment_method } = req.body;
    console.log('user_id', user_id);

    if (!room_id || !reservation_date || !amount || !payment_method) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const connection = conn; // Start a transaction
    try {
        await connection.beginTransaction();

        // Step 1: Create the reservation
        const [reservationResult] = await connection.execute(
            'INSERT INTO Room_Reservations (user_id, room_id, reservation_date, status, payment_status) VALUES (?, ?, ?, ?, ?)',
            [user_id, room_id, reservation_date, 'pending', 'pending']
        );

        const reservation_id = reservationResult.insertId;

        // Step 2: Process the payment
        const [paymentResult] = await connection.execute(
            'INSERT INTO Reservation_Payments (reservation_id, amount_paid, payment_method, status) VALUES (?, ?, ?, ?)',
            [reservation_id, amount, payment_method, 'paid']
        );

        // Step 3: Update reservation payment status
        await connection.execute(
            'UPDATE Room_Reservations SET payment_status = ? WHERE reservation_id = ?',
            ['paid', reservation_id]
        );

        await connection.execute(
            'UPDATE Rooms SET status = ? WHERE room_id = ?',
            ['reserved', room_id]
        );

        // Commit the transaction
        await connection.commit();

        res.json({
            message: 'Reservation and payment completed successfully',
            reservation_id: reservation_id,
            payment_id: paymentResult.insertId,
        });
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error('Error during reservation and payment:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    } finally {
        //connection.release(); // Release the connection
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

app.post('/monthly_bills', async (req, res) => {
    const bill = req.body;

    if (!bill.room_id || !bill.billing_date || !bill.rent_amount || !bill.electricity_usage || 
        !bill.electricity_cost || !bill.water_usage || !bill.water_cost || !bill.total_amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [results] = await conn.execute(
            'INSERT INTO Monthly_Bills (room_id, billing_date, rent_amount, electricity_usage, electricity_cost, water_usage, water_cost, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [bill.room_id, bill.billing_date, bill.rent_amount, bill.electricity_usage, bill.electricity_cost, bill.water_usage, bill.water_cost, bill.total_amount]
        );

        res.json({
            message: 'Monthly bill added successfully',
            bill_id: results.insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/monthly_bills', async (req, res) => {
    const roomId = req.query.room_id;

    let sql = 'SELECT * FROM Monthly_Bills';
    let params = [];

    if (roomId) {
        sql += ' WHERE room_id = ?';
        params.push(roomId);
    }

    try {
        const [results] = await conn.execute(sql, params);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(port, async () => {
    await initMYSQL();
    console.log('Http Server is running on port ' + port);
});


