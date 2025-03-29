
// API Part

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  // Ensure you're using mysql2/promise
const cors = require('cors');
const app = express();

const port = 8000;
app.use(bodyParser.json());
app.use(cors());

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

app.listen(port, async () => {
    await initMYSQL();
    console.log('Http Server is running on port ' + port);
});
