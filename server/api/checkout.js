const router = require("express").Router();
const { Product, Order, User, OrderItem } = require("../db/models");
const stripe = require("stripe")("sk_test_rxtsARxWfn5RXhJGnCNLdzgB");
const { uuid } = require("uuidv4");
const cors = require("cors");
const { stockCheck } = require("./middleware");

router.use(cors());
module.exports = router;

router.post("/", stockCheck, async (req, res, next) => {
  // console.log("Request:", req.body.token.total);
  let error;
  let status;
  try {
    const { token } = req.body;
    const total = Number(token.total).toFixed(2);
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });
    const idempotencyKey = uuid();
    const charge = await stripe.charges.create(
      {
        amount: total * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotencyKey
      }
    );
    // console.log("Charge:", { charge });
    status = "success";
    req.cartId = token.cartId;
    req.total = token.total;
    req.charge = charge;
    console.log("req.charge in stripe", req.charge);
    next();
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
    res.json({ error, status });
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log("req.charge in backend", req.charge);
    let items = await OrderItem.findAll({
      where: { orderId: req.cartId }
    });
    // console.log(items);
    items.forEach(async item => {
      //removing quantity from product stock
      let product = await Product.findByPk(item.productId);
      product.stock = product.stock - item.quantity;
      let p1 = await product.save();
      //adding the price to the orderItem to save price at checkout
      item.price = product.price;
      let p2 = await item.save();
      //updating order to completed and saving the final total price
      let order = await Order.findByPk(req.cartId);
      order.total = req.total;
      order.status = "completed";
      let p3 = await order.save();
      let user = await User.findByPk(order.userId);
      if (user) {
        let { address } = req.charge.shipping;
        user.address = `${address.line1} ${address.line2} ${address.city} ${address.country} ${address.postal_code} `;
      } else {
        delete req.session.cartId;
        user = req.session;
      }
      let p4 = await user.save();
      Promise.all([p1, p2, p3, p4]);
      let status = "success";
      console.log({ status: status, charge: req.charge });

      res.json({ status });
    });
  } catch (err) {
    next(err);
  }
});
