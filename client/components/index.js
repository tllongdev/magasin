/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Navbar } from './navbar';
export { default as SingleProduct } from './SingleProduct';
export { default as UserHome } from './UserHome';
export { Login, Signup } from './AuthForm';
export { default as AllProducts } from './AllProducts';
export { default as CheckOut } from './CheckOutButton';
export { default as Cart } from './Cart';
export { default as NotFound } from './NotFound';
export { default as AdminHome } from './AdminHome';
export { default as AdminUsers } from './AdminUsers';
export { default as AdminProducts } from './AdminProducts';
export { default as AdminOrders } from './AdminOrders';
export { default as SplashPage } from './SplashPage';

export { default as AdminEditUser } from './AdminEditUser';
export { default as AdminEditProduct } from './AdminEditProduct';
export { default as AdminAddProduct } from './AdminAddProduct';
export { default as ReviewForm } from './ReviewForm';
export { default as UserSingleOrder } from './UserSingleOrder';
