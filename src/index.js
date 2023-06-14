const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

// import routes
const OrdersRoute = require("./routes/processOrders");

app.use(express.json());

// routes
app.use('/orders', OrdersRoute);


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
