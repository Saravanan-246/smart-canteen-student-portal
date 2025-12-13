import PaymentSettings from "../models/PaymentSettings.js";

export const updateUPI = async (req, res) => {
  const { upiId, upiName } = req.body;

  const settings = await PaymentSettings.findOneAndUpdate(
    {},
    { upiId, upiName, updatedAt: new Date() },
    { new: true, upsert: true }
  );

  res.json({ success: true, settings });
};

export const getUPI = async (req, res) => {
  const settings = await PaymentSettings.findOne();
  if (!settings) return res.json({ success: false, message: "UPI not set yet" });

  res.json({ success: true, settings });
};
