const { response } = require("express");
const Customer = require("../models/customer");
const Customer_Call = require("../models/customers/customer_call");
const Customer_Mail = require("../models/customers/customer_mail");

var fs = require("fs");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const create_call = async (req, res = response) => {
  let data = req.body;
  try {
    data.advisor = req.id;
    let reg = await Customer_Call.create(data);
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_calls = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Call.find({ customer: id }).populate("advisor").sort({ created_at: -1 });
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const create_mail = async (req, res = response) => {
  let data = req.body;
  try {
    data.advisor = req.id;
    let customer = await Customer.findById({ _id: data.customer });
    let reg = await Customer_Mail.create(data);
    send_email_prospect(customer.full_name, data.asunt, customer.email, data.container);
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_mails = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Mail.find({ customer: id }).populate("advisor").sort({ created_at: -1 });
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const send_email_prospect = async (customer, asunt, email, container) => {
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: { user: "aranibargerson28@gmail.com", pass: "rkzxjmwoqaeupyuq" },
    })
  );

  //OBTENER CLIENTE
  var customer = await Customer.findOne({ email });

  readHTMLFile(process.cwd() + "/mails/mail_message.html", (err, html) => {
    let rest_html = ejs.render(html, { cliente: customer.full_name, asunto: asunt, email: email, contenido: container });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: "aranibargerson28@gmail.com",
      to: email,
      subject: asunt,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

module.exports = {
  create_call,
  read_calls,
  create_mail,
  read_mails,
};
