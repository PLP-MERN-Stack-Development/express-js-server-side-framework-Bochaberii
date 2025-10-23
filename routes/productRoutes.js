
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Middleware for logging requests
const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
};

// Middleware for API key authentication
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
    }
    next();
};

// Middleware for validating product data
const validateProduct = (req, res, next) => {
    const { name, description, price, category } = req.body;
    
    if (!name || !description || !price || !category) {
        return res.status(400).json({ 
            message: 'Validation Error: name, description, price, and category are required' 
        });
    }
    
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ 
            message: 'Validation Error: price must be a positive number' 
        });
    }
    
    next();
};

// Apply logger middleware to all routes
router.use(loggerMiddleware);

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const query = {};
        
        // Filter by category if provided
        if (category) {
            query.category = category;
        }
        
        // Search by name if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        // Pagination
        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await Product.countDocuments(query);
        
        res.json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProducts: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/stats - Get product statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    totalValue: { $sum: '$price' }
                }
            }
        ]);
        
        const totalProducts = await Product.countDocuments();
        const inStockCount = await Product.countDocuments({ inStock: true });
        
        res.json({
            totalProducts,
            inStockCount,
            outOfStockCount: totalProducts - inStockCount,
            byCategory: stats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/:id - Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

// POST /api/products - Create a new product (with auth and validation)
router.post('/', authMiddleware, validateProduct, async (req, res) => {
    try {
        const { name, description, price, category, inStock } = req.body;
        
        const product = new Product({
            name,
            description,
            price,
            category,
            inStock: inStock !== undefined ? inStock : true
        });
        
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/products/:id - Update a product (with auth and validation)
router.put('/:id', authMiddleware, validateProduct, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/products/:id - Delete a product (with auth)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully', product });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
// router.get('/', async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.json(students);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: error.message });
//     }
// });

// Create a new student
// router.post('/', async(req, res) => {
//     const { name, age, email } = req.body;

//     try { 
//         const student = new Student({ name, age, email });
//         const saved = await student.save();
//         res.status(201).json(saved); //201 status code for created successfully
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })

//Update Student by id
// router.put('/:id', async (req, res)=> {
//     try {
//         const student = await Student.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true } //to return the updated document
//         );
//         res.json(student);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })

// //Delete Student by id

// router.delete('/:id', async (req, res) => {
//     try {
//         await Student.findByIdAndDelete(req.params.id);
//         res.json({ message: "Student deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })

// module.exports = router;