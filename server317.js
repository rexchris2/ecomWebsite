//Imports
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();



var message = 'CSC-317 startup template\n'
    + 'This template uses nodeJS, express, and express.static\n';

var port = 3000;
var app = express();
const fs = require('fs');
const { checkServerIdentity } = require('tls');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session 
app.use(
    session({
        secret: 'some secret key',
        resave: false,
        saveUninitialized: true
    }));



var StaticDirectory = path.join(__dirname, 'public',);
app.use(express.static(StaticDirectory));


//MYsql db connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'eComData'
});

const db2 = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'eComData'
});



//Connect
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});



//User register
app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, street, city, state, zip } = req.body;


    if (!firstname || !lastname || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        //Bcrypt hash
        const salt = await bcrypt.genSalt(10);
        const hashedPaswword = await bcrypt.hash(password, salt);

        const userQuery = 'INSERT INTO Users (firstname,lastname,email,password) VALUES (?,?,?,?)';
        db.query(userQuery, [firstname, lastname, email, hashedPaswword], (err, userResults) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }
            //Get user ID
            const userId = userResults.insertId;

            //Insert address with accoridng user ID
            const addressQuery = 'INSERT INTO Addresses (user_id,street,city,state,zip) VALUES (?,?,?,?,?)';
            db.query(addressQuery, [userId, street, city, state, zip], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Database error');
                }
                res.redirect('/login.html');
                console.log('Account Created!');

            });

        });

    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).send({ message: 'Encryption error' });
    }
});

//User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //Query into DB 
    db.query('SELECT * FROM Users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('DB Error', error);
            return res.status(500).send('DB error');
        }
        //Exists or not
        if (results.length == 0) {
            return res.status(401).send('Invalid email or password');
        }
        const user = results[0];
        console.log(user);

        const userID = results[0].id;
        console.log(userID);

        db.query('SELECT * FROM Addresses WHERE user_id = ?', [userID], (error, addResults) => {
            if (error) {
                console.log("Error getting address");
            }

            const userAddress = addResults[0];
            console.log(userAddress);


            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing password', err);
                    return res.status(500).send('Error comparing passwords');
                }

                //If password matches
                if (isMatch) {
                    req.session.user = { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname };
                    req.session.userAddress = { street: userAddress.street, city: userAddress.city, state: userAddress.state, zip: userAddress.zip };

                    //Print to console (debug)
                    console.log(user.email, user.password, user.firstname, user.lastname);
                    console.log(userAddress.street, userAddress.city, userAddress.state, userAddress.zip);
                    console.log('Login successful');


                    res.redirect('/account_page.html');

                } else {
                    return alert('Wrong Email or Password');
                }
            });
        });
    });
});

//Account info
app.get('/account', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('You are not logged in');
    }
    const user = req.session.user;

    res.json(user);
});

//Account address
app.get('/accountAddress', (req, res) => {

    const userAddress = req.session.userAddress;

    res.json(userAddress);

});

//Update address
app.post('/updateAddress', async (req, res) => {
    const { street, city, state, zip } = req.body;
    const userID = req.session.user.id;

    //Find id and update addresses
    db.query('UPDATE Addresses SET street = ?, city = ?, state = ?, zip = ? WHERE user_id = ?',
        [street, city, state, zip, userID], (error, results) => {
            res.redirect('/account_page.html');
            console.log('Address Updated!');
        });

});

//Update name
app.post('/updateName', async (req, res) => {
    const { firstname, lastname } = req.body;
    const userID = req.session.user.id;

    db.query('UPDATE Users Set firstname = ?, lastname = ? WHERE id = ?',
        [firstname, lastname, userID], (error) => {
            res.redirect('/account_page.html');
            console.log("Name Updated!")
        });
});

//Update password
app.post('/updatePassword', async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.session.user.id;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPaswword = await bcrypt.hash(newPassword, salt);
        db.query('UPDATE Users Set password = ? WHERE id = ?',
            [hashedPaswword, userId], (error) => {
                res.redirect('/account_page.html');
                console.log("Password Updated!");
            });

    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).send({ message: 'Encryption error' });
    }

});


//Session logged in or nah
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

//Logging out
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error');
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

console.log(message);
