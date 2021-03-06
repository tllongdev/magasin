import React, { useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/cart';
import CartItem from './CartItem';
import CheckOut from './CheckOutButton';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  useEffect(() => {
    dispatch(fetchCart());
  }, [user]);

  const subTotal =
    cart.products &&
    cart.products
      .reduce((acc, prod) => acc + +prod.price * prod.orderItem.quantity, 0)
      .toFixed(2);

  let taxRate = 0.1025;

  const taxAmount = subTotal * taxRate;

  const cartTotal = +subTotal + +taxAmount;

  let quantityValidationId = 0;

  return cart.products && cart.products.length ? (
    <div className="container-fluid" style={{ width: '100%' }}>
      <Fade cascade>
        <div className="d-flex justify-content-between mt-2 mb-2 ml-4 mr-4">
          <cite>
            <h3 className="mt-3 text-light">Shopping Cart</h3>
          </cite>
        </div>
      </Fade>
      <Fade cascade>
        <div className="row">
          <div className="col align-content-center m-2 mr-2">
            {cart.products.map(cartItem => {
              ++quantityValidationId;
              return (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  qtyId={quantityValidationId}
                />
              );
            })}
          </div>
        </div>
        {/* checkout-pod */}
        <div className="container-fluid">
          <div className="row px-2 pb-3">
            <div className="col-sm"></div>
            <div className="col-sm"></div>
            <div className="checkout-pod col-md">
              <div className="summary-totals m-4">
                <div className="border-top border-bottom">
                  <div className="row cartTotals">
                    <div className="col-6 font-weight-bold">Subtotal</div>
                    <div className="col-6 font-weight-bold text-right">
                      ${subTotal}
                    </div>
                    <div className="col-6">Shipping</div>
                    <div className="col-6 text-right">FREE</div>
                    <div className="col-6">Sales Tax</div>
                    <div className="col-6 text-right">
                      ${taxAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="row total mt-2 mb-2">
                  <div className="col-4">
                    <h3
                      className="font-weight-bold"
                      style={{ fontSize: '120% ' }}
                    >
                      Total
                    </h3>
                  </div>
                  <div className="col-8">
                    <h3
                      className="font-weight-bold text-right"
                      style={{ fontSize: '120% ' }}
                    >
                      ${cartTotal.toFixed(2)}
                    </h3>
                  </div>
                </div>
                {/* checkout needs to be passed in total and cartId */}
                {cart.products && (
                  <CheckOut
                    cart={cart}
                    cartId={cart.id}
                    total={cartTotal.toFixed(2)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4"></div>
      </Fade>
    </div>
  ) : (
    <div className="container-fluid text-center mb-mt-5 pt-5 text-light">
      <Fade>
        <h3 className="p-5 shadow">There are no items in your cart.</h3>
      </Fade>
    </div>
  );
};

export default Cart;
