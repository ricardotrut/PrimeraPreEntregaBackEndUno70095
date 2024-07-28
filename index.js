// Importamos express y las clases de los otros archivos .js
import express from 'express';
import ProductManager from './productManager.js';
import CartManager from './cartManager.js';


const productManager = new ProductManager();
const cartManager = new CartManager();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//////////// PRODUCTOS ///////////////////

// Obtener todos los productos 
app.get('/api/products', async (req, res) => {
    try {
        const products = await productManager.showProducts();
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el producto' });
    }
});



// Agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || stock === undefined || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
        }
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || []
        };
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el producto' });
    }
});

// Actualizar un producto por ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updatedProduct = req.body;
        const product = await productManager.updateProduct(productId, updatedProduct);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json(deletedProduct);
        } else {
            res.status(400).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el producto' });
    }
});

/////////////////CART/////////////////////////
// Crear un nuevo carrito
app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el carrito' });
    }
});

// Listar productos en un carrito por ID de carrito
app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(400).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar un producto al carrito por ID de carrito y producto
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const cart = await cartManager.addProductToCart(cartId, productId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(400).json({ error: 'Carrito no encontrado o producto no agregado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Ruta por si no encuentra 
app.get('*', (req, res) => {
    res.send('Ruta no encontrada');
});



app.listen(8080, () => console.log('Servidor en 8080'));