import fs from 'fs';

class CartManager {
    constructor() {
       
    }
// mostrar el carrito
    async showCarts() {
        try {
            const data = await fs.promises.readFile('./carts.json');
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al leer archivo', error);
            return [];
        }
    }
    // mostrar carrito por ID
    async getCartById(id) {
        try {
            const carts = await this.showCarts();
            return carts.find(cart => cart.id === id);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            return null;
        }
    }
    // crear carrito
    async addCart() {
        try {
            const carts = await this.showCarts();
            let newId;
        if (carts.length > 0) {
            const maxId = Math.max(...carts.map(c => c.id));
            newId = maxId + 1;
        } else {
         newId = 1;
        }
            const newCart = { id: newId, products: [] };
            carts.push(newCart);
            await fs.promises.writeFile('./carts.json', JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
            return null;
        }
    }
    // agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.showCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                throw new Error('Carrito no encontrado');
            }
            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(product => product.id === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            await fs.promises.writeFile('./carts.json', JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            return null;
        }
    }
}

export default CartManager;