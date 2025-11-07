require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectToDatabase } = require("./db/connection");
const productStore = require("./db/productStore");
const cartStore = require("./db/cartStore");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

async function bootstrap() {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
      : "*",
    credentials: true
  }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/checkout", checkoutRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const port = process.env.PORT || 5000;

  const requireDatabase = process.env.REQUIRE_DATABASE === "true";
  await connectToDatabase(process.env.MONGO_URI, { requireDatabase });
  await productStore.init();
  await cartStore.init();

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start the server", error);
  process.exit(1);
});
