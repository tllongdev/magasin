const router = require("express").Router();
const { Product, Order, User, OrderItem } = require("../db/models");
const { loggedIn } = require("../api/middleware");
module.exports = router;

router.get("/", async (req, res, next) => {
  // console.log(req.session.user);
  try {
    const userCart = await Order.findOne({
      where: { userId: req.session.user.id, status: "pending" },
      include: { model: Product, order: [["id", "ASC"]] }
    });
    if (userCart) {
      res.json(userCart);
    } else {
      res.json({});
    }
  } catch (err) {
    next(err);
  }
});

router.put("/addItem", loggedIn, async (req, res, next) => {
  try {
    let userCart = await Order.findOne({
      where: { userId: req.session.user.id, status: "pending" }
    });
    if (userCart) {
      const product = await Product.findByPk(req.body.productId);
      const orderItem = await OrderItem.findOne({
        where: { productId: product.id, orderId: userCart.id }
      });
      if (orderItem) {
        req.body.quantity
          ? (orderItem.quantity = req.body.quantity)
          : orderItem.quantity++;
        await orderItem.save();
      } else {
        await OrderItem.create({
          productId: product.id,
          orderId: userCart.id,
          quantity: req.body.quantity ? req.body.quantity : 1
        });
      }
      let updatedCart = await Order.findByPk(userCart.id, {
        include: {
          model: Product,
          order: [["id", "ASC"]]
        }
      });
      res.json(updatedCart);
    } else {
      let newCart = await Order.create();
      let user = await User.findByPk(req.session.user.id);
      console.log(user);
      await user.addOrder(newCart);
      const product = await Product.findByPk(req.body.productId);
      await OrderItem.create({
        productId: product.id,
        orderId: newCart.id,
        quantity: req.body.quantity
      });
      let updatedCart = await Order.findByPk(newCart.id, {
        include: {
          model: Product,
          order: [["id", "ASC"]]
        }
      });
      res.json(updatedCart);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/removeItem", async (req, res, next) => {
  try {
    // console.log("in Route");
    let userCart = await Order.findOne({
      where: { userId: req.session.user.id, status: "pending" }
    });
    const orderItem = await OrderItem.findOne({
      where: { orderId: userCart.id, productId: req.body.productId }
    });
    await orderItem.destroy();
    let updatedCart = await Order.findByPk(userCart.id, {
      include: { model: Product, order: [["id", "ASC"]] }
    });

    res.json(updatedCart);
  } catch (err) {
    next(err);
  }
});
