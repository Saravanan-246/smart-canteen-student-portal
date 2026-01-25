import jwt from "jsonwebtoken";

const studentAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_STUDENT_SECRET // ✅ FIXED
    );

    req.student = {                // ✅ FIXED
      id: decoded.id,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid student token",
    });
  }
};

export default studentAuth;
