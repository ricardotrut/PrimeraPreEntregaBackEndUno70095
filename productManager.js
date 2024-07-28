import fs from 'fs';

class ProductManager {
    constructor() {
       
    }

    // mostrar todos los productos 
    async showProducts() {
        try {
            const product = await fs.promises.readFile('./products.json'); 
            return JSON.parse(product); 
        } catch (error) {
            console.log('Error al leer archivo', error);
            return [];
        }
    }
    // onbtener los productos por el ID
    async getProductById(id) {
        try {
            const products = await this.showProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            return null;
        }
    }

    // agregar un producto
    async addProduct(newProduct) {
        try {
            const products = await this.showProducts();
            let newId;
            if (products.length > 0) {

            const maxId = Math.max(...products.map(p => p.id));

            newId = maxId + 1;
            } else {

             newId = 1;
            }
            const productWithId = { 
                    id: newId,
                 ...newProduct,
                    status: true };

            products.push(productWithId);
            await fs.promises.writeFile('./products.json', JSON.stringify(products, null, 2));
            return productWithId;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    // actualizar un producto
    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.showProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }
            const product = products[index];
            // Actualiza
            products[index] = { ...product,
                 ...updatedProduct,
                  id: product.id };
                  
            await fs.promises.writeFile('./products.json', JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }
    // borrar un producto por ID
    async deleteProduct(id) {
        try {
            const products = await this.showProducts();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }
            const deletedProduct = products.splice(index, 1);
            await fs.promises.writeFile('./products.json', JSON.stringify(products, null, 2));
            return deletedProduct[0];
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

}


export default ProductManager;
