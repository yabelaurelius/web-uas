const express = require('express');
const { body, validationResult } = require('express-validator');
const bookRoutes = express.Router();
const bookService = require('../services/bookService');

// Get collection
bookRoutes.get('/', async (req, res, next) => {
    try {
        return res.json(await bookService.findMany(req.query.page));
    } catch (err) {
        console.error(`Error while retrieving all book.`);
        next(err);
    }

    return res.send('Received a GET HTTP method');
});

// Get unit
bookRoutes.get('/:id', async (req, res, next) => {
    try { 
        return res.json(await bookService.findOneById(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving book of ID ${req.params.id}.`);
        next(err);
    }
});

// Create
bookRoutes.post('/',
body('title').isString(),
body('author_id').isInt({ min: 1 }),
async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return res.json(await bookService.createOne(req.body));
    } catch (err) {
        console.error(`Error while creating book.`);
        next(err);
    }
});

// Update
bookRoutes.put('/:id',
body('title').optional().isString(),
body('author_id').optional().isInt({ min: 1 }),
body('price').optional().isDecimal(),
body('quantity').optional().isInt({ min: 0 }),
async (req, res, next) => {
    try {
        return res.json(await bookService.updateOneById(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating book of ID ${req.params.id}.`);
        next(err);
    }
});

// Delete
bookRoutes.delete('/:id', async (req, res, next) => {
    try {
        return res.json(await bookService.deleteOneById(req.params.id));
    } catch (err) {
        console.error(`Error while deleting book of ID ${req.params.id}.`);
        next(err);
    }
});

module.exports = bookRoutes;