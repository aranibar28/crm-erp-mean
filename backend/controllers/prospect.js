const { response } = require("express");

const Customer = require("../models/customer");

const create_customer = async (req, res = response) => {
  let data = req.body;
  console.log(data);
  try {
    return res.json({ data: "create_customer" });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

module.exports = {
  create_customer,
};
