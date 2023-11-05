import productsRepository from '../repositories/index.js';
import cartsRepository from '../repositories/index.js';
import User from '../dao/models/userModel.js';
import UserDTO from '../dto/user.dto.js';

const productManager = productsRepository.productsRepository;
const cartManager = cartsRepository.cartsRepository;

import { developmentLogger, productionLogger } from '../config/logger.js';

export const renderHome = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const user = req.session.user;
    if (!user) {
      return res.render('home', {
        user: null,
        products: products,
      });
    }

    res.render('home', {
      user: new UserDTO(user),
      products: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

export const renderRealTimeProducts = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
      title: 'Real Time Products',
      products: products,
    });
  } catch (error) {
    console.error('Error fetching real-time products:', error);
    res.status(500).send('Error fetching real-time products');
  }
};

export const renderProductsPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPage(
      limit,
      page
    );

    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Error retrieving products');
  }
};

export const addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const user = req.session.user;
    console.log(user);
    
    const product = await productManager.getProductById(productId);

    if (!product) {
      // Si el producto no existe o no tiene propietario, muestra un error.
      return res.status(404).json({ message: 'Product not found or has no owner' });
    }

    if (!user.cart) {
      let userCart = await cartManager.createCartEmail(user.email);
      user.cart = userCart;
      await req.session.save();
    }
    else {
      const user = req.session.user;
      const isOwner = await cartManager.isUserCartOwner(user.email, user.cart._id);
      if (!isOwner) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      
    }

    console.log(user.cart);


    const products = await cartManager.addProductToCart(user.cart._id, productId);
    
    user.cart.products = products;
    await req.session.save();
    console.log(user);
    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Error adding product to cart' });
  }
}

export const renderCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      return res.render('carts', { cartId: cartId, products: cart.products });
    } else {
      return res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ error: 'Error retrieving cart' });
  }
};

export const renderChat = (req, res) => {
  res.render('chat');
};

export const renderRegister = (req, res) => {
  res.render('register');
};

export const renderLogin = (req, res) => {
  res.render('login');
};


export const insertMockProducts = async (req, res) => {
  try {

    const count = 50;
    const products = await productManager.insertMockProducts(count);
    return res.status(200).json({ products: products, message: 'Productos generados con éxito' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al generar los productos' });
  }
};

export const loggerTest = (req, res) => {
    developmentLogger.debug('Debug message');
    developmentLogger.http('HTTP message');
    developmentLogger.info('Info message');
    developmentLogger.warning('Warning message');
    developmentLogger.error('Error message');
    developmentLogger.fatal('Fatal message');
  
    productionLogger.debug('Production debug message');
    productionLogger.http('Production HTTP message');
    productionLogger.info('Production info message');
    productionLogger.warning('Production warning message');
    productionLogger.error('Production error message');
    productionLogger.fatal('Production fatal message');
  
    res.send('Logs generated. Check the console and the "errors.log" file on your server.');
};

export const editUser = async (req, res) => {
  try{
    const users = await User.find().lean();
    return res.render('role', {users: users});
  }catch (error) {
    return res.status(500).json({ error: 'Error al enviar usuarios' });
  }
};
