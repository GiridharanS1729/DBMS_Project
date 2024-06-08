const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 5000;

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Giri@1729.S!',
    database: 'visitor'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add visitor
app.post('/addVisitor', (req, res) => {
    let visitor = {
        room: req.body.room,
        name: req.body.name,
        phone: req.body.phone,
        aadhar: req.body.aadhar
    };
    let sql = 'INSERT INTO persons SET ?';
    db.query(sql, visitor, (err, result) => {
        if (err) {
            console.error('Error adding visitor:', err);
            res.status(500).send('Server error');
        } else {
            res.send({ message: 'Visitor added successfully' });
        }
    });
});

// View visitors
app.get('/viewVisitor', (req, res) => {
    let sql = 'SELECT * FROM persons';
    db.query(sql, (err, results) => {
        if (err) throw err;
        let tableRows = results.map(result => `
            <tr>
                <td>${result.room}</td>
                <td>${result.name}</td>
                <td>${result.phone}</td>
                <td>${result.aadhar}</td>
            </tr>
        `).join('');
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>View Visitors</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f0f0f0;
                    }
                    h1, h2 {
                        text-align: center;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                        color: #333;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                </style>
            </head>
            <body>
                <h1>Visitor Information</h1>
                <table>
                    <tr>
                        <th>Room</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Aadhar</th>
                    </tr>
                    ${tableRows}
                </table>
            </body>
            </html>
        `);
    });
});

// Update visitor
app.post('/updateVisitor', (req, res) => {
    let { room, name, phone, aadhar } = req.body;
    let sql = 'UPDATE persons SET name = ?, phone = ?, aadhar = ? WHERE room = ?';
    db.query(sql, [name, phone, aadhar, room], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Visitor updated successfully' });
    });
});

// Delete visitor
app.post('/deleteVisitor', (req, res) => {
    let { room } = req.body;
    let sql = 'DELETE FROM persons WHERE room = ?';
    db.query(sql, [room], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Visitor deleted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
