const express = require('express');
const { body, validationResult } = require('express-validator');
const authorRoutes = express.Router();
const authorService = require('../services/authorService');

// Get collection
authorRoutes.get('/', async (req, res, next) => {
    try {
        return res.json(await authorService.findMany(req.query.page));
    } catch (err) {
        console.error(`Error while retrieving all author.`);
        next(err);
    }

    return res.send('Received a GET HTTP method');
});

// Get unit
authorRoutes.get('/:id', async (req, res, next) => {
    try { 
        return res.json(await authorService.findOneById(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving author of ID ${req.params.id}.`);
        next(err);
    }
});

// Create
authorRoutes.post('/',
body('first_name').isString(),
body('last_name').optional().isString(),
async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return res.json(await authorService.createOne(req.body));
    } catch (err) {
        console.error(`Error while creating author.`);
        next(err);
    }
});

// Update
authorRoutes.put('/:id',
body('first_name').optional().isString(),
body('last_name').optional().isString(),
async (req, res, next) => {
    try {
        return res.json(await authorService.updateOneById(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating author of ID ${req.params.id}.`);
        next(err);
    }
});

// Delete
authorRoutes.delete('/:id', async (req, res, next) => {
    try {
        return res.json(await authorService.deleteOneById(req.params.id));
    } catch (err) {
        console.error(`Error while deleting author of ID ${req.params.id}.`);
        next(err);
    }
});

module.exports = authorRoutes;