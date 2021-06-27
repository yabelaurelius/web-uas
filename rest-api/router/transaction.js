const express = require('express');
const { body, validationResult } = require('express-validator');
const transactionRoutes = express.Router();
const transactionService = require('../services/transactionService');

// Get collection
transactionRoutes.get('/', async (req, res, next) => {

    try {
        return res.json(await transactionService.findMany(req.query.page));
    } catch (err) {
        console.error(`Error while retrieving all transaction.`);
        next(err);
    }

    return res.send('Received a GET HTTP method');
});

// Get unit
transactionRoutes.get('/:id', async (req, res, next) => {
    try { 
        return res.json(await transactionService.findOneById(req.params.id));
    } catch (err) {
        console.error(`Error while retrieving transaction of ID ${req.params.id}.`);
        next(err);
    }
});

// Create
transactionRoutes.post('/',
body('member_id').isInt({ min: 1}),
body('is_paid').optional().isBoolean(),
async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return res.json(await transactionService.createOne(req.body));
    } catch (err) {
        console.error(`Error while creating transaction.`);
        next(err);
    }
});

// Update
transactionRoutes.put('/:id',
body('member_id').optional().isInt({ min: 1}),
body('is_paid').optional().isBoolean(),
async (req, res, next) => {
    try {
        return res.json(await transactionService.updateOneById(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating transaction of ID ${req.params.id}.`);
        next(err);
    }
});

// Delete
transactionRoutes.delete('/:id', async (req, res, next) => {
    try {
        return res.json(await transactionService.deleteOneById(req.params.id));
    } catch (err) {
        console.error(`Error while deleting transaction of ID ${req.params.id}.`);
        next(err);
    }
});

module.exports = transactionRoutes;