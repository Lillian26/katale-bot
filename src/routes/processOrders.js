const express = require('express');
const router = express.Router()

const axios = require('axios');
const ecwidToken = process.env.ECWID_SECRETE_TOKEN;
const storeId = process.env.ECWID_STORE_ID;

router.get("/", async (req, res) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://app.ecwid.com/api/v3/' + storeId + '/orders?fulfillmentStatus=AWAITING_PROCESSING&token=' + ecwidToken,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  };

  // console.log("config: ", config)
  try {
    const ecwidResponse = await axios.request(config);
    // console.log("ecwidResponse: ", ecwidResponse);

    const orders = ecwidResponse.data.items;
    console.log("orders: ", orders);

    let message = '';
    // Process each order
    for (const order of orders) {
      const orderId = order.id;
      const orderItems = order.items;
      const email = order.email;
      const b2b_b2c = order.b2b_b2c;
      const address = `${order.billingPerson.street}, ${order.billingPerson.city}, ${order.billingPerson.countryName}`;
      const phone = `${order.billingPerson.phone}`;

      // Emit a message with processed list of items
      message = `${b2b_b2c}, ${email}, ${phone}\nOrder ID: ${orderId}\n Items:\n`;
      for (const item of orderItems) {
        const itemName = item.name;
        const itemQuantity = item.quantity;
        message += `${itemName} - Quantity: ${itemQuantity}\n`;
      }
      message += '\n\n'
    }
    return res.status(200).json(message);

  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;