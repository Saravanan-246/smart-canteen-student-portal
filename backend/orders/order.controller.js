import Order from "./order.model.js";

/* =========================
   STUDENT CONTROLLERS
========================= */

// CREATE ORDER (Student)
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing order data",
      });
    }

    // ✅ FIXED: use req.student.id
    const order = await Order.create({
      studentId: req.student.id,
      items,
      totalAmount,
      status: "paid",
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Create order error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// GET MY ORDERS (Student)
export const getMyOrders = async (req, res) => {
  try {
    // ✅ FIXED: use req.student.id
    const orders = await Order.find({
      studentId: req.student.id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Get my orders error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* =========================
   ADMIN CONTROLLERS
========================= */

// GET ALL ORDERS (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("studentId", "name email") // 🔧 small safe fix
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Get all orders error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// UPDATE ORDER STATUS (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["paid", "preparing", "ready", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Update order status error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};
