require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config/config');
const logger = require('morgan');

const authorRoute = require('./router/author');
const bookRoute = require('./router/book');
const transactionRoute = require('./router/transaction');

var corsOptions = {
    origin: "http://localhost:8080"
};
app.use(cors(corsOptions));
app.use(logger("dev"));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

function middleware(req, res, next) {
    if(req.path == '/')
        return next();

    console.log(req)

    if(req.query.authorization === "HelloWorld") {
        console.log("Terverifikasi");
        return next();
    } else {
        const err = {
            status: "error",
            data: {
                nim: req.query.authorization,
            },
        };

        return next(err);
    }
};

app.all('*', middleware);

// Registering route
app.use('/author', authorRoute);
app.use('/book', bookRoute);
app.use('/transaction', transactionRoute);

// Return error JSON on any route failure
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ 'message': err.message });

    return;
});

// Set port listening requests
app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
})