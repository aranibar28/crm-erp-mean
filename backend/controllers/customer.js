const { response } = require("express");
const bcrypt = require("bcryptjs");
const Customer = require("../models/customer");
const jwt_customer = require("../helpers/jwt");
const jwt = require("jwt-simple");

var fs = require("fs");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var path = require("path");

const create_customer = async (req, res = response) => {
  let data = req.body;
  try {
    var exist_email = await Customer.findOne({ email: data.email });
    if (exist_email) {
      return res.json({ data: undefined, msg: "Este correo ya se encuentra registrado." });
    } else {
      data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
      data.full_name = data.first_name + " " + data.last_name;
      data.advisor = req.id;
      let reg = await Customer.create(data);
      send_email_verify(data.email);
      return res.json({ data: reg });
    }
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_customers = async (req, res = response) => {
  let filter = req.params["filter"];

  if (filter === "all") {
    let reg = await Customer.find();
    return res.json({ data: reg });
  }

  let reg = await Customer.find({
    $or: [
      { first_name: new RegExp(filter, "i") },
      { last_name: new RegExp(filter, "i") },
      { email: new RegExp(filter, "i") },
      { dni: new RegExp(filter, "i") },
    ],
  });
  res.json({ data: reg });
};

const read_customer_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer.findById(id).populate("advisor");
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const update_customer = async (req, res = response) => {
  let id = req.params["id"];
  let user = await Customer.findById(id);
  const { email, password, ...data } = req.body;

  try {
    if (user.email !== email) {
      var exist_email = await Customer.findOne({ email });
      if (exist_email) {
        return res.json({ data: undefined, msg: "Este correo ya se encuentra registrado." });
      } else {
        data.email = email;
      }
    }

    if (user.password != password) {
      var new_password = bcrypt.hashSync(password, bcrypt.genSaltSync()); // Encriptación de la nueva contraseña
      data.password = new_password;
    } else {
      data.password = password;
    }

    data.full_name = data.first_name + " " + data.last_name;
    let reg = await Customer.findByIdAndUpdate(id, data, { new: true });
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const delete_customer = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer.findByIdAndDelete(id);
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  var new_status = data.status ? false : true;
  reg = await Customer.findByIdAndUpdate(id, { status: new_status });
  res.json({ data: reg });
};

const login_customer = async (req, res = response) => {
  let { email, password } = req.body;
  try {
    let user = await Customer.findOne({ email });
    if (!user) {
      return res.json({ data: undefined, msg: "Este correo no existe en la base de datos." });
    } else {
      var valid_password = bcrypt.compareSync(password, user.password);
      if (!valid_password) {
        return res.json({ data: undefined, msg: "La contraseña es incorrecta." });
      } else {
        if (!user.status) {
          return res.json({ data: undefined, msg: "El usuario no tiene acceso al panel." });
        } else {
          const token = jwt_customer.createToken(user);
          return res.json({ data: user, token });
        }
      }
    }
  } catch (error) {
    return res.json({ data: undefined, msg: error.message });
  }
};

const send_email_verify = async (email) => {
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
      auth: {
        user: "aranibargerson28@gmail.com",
        pass: "rkzxjmwoqaeupyuq",
      },
    })
  );

  //OBTENER CLIENTE
  var customer = await Customer.findOne({ email });
  var token = jwt_customer.createTokenCustomer(customer);

  readHTMLFile(process.cwd() + "/mails/account_verify.html", (err, html) => {
    let rest_html = ejs.render(html, { token: token });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: "aranibargerson28@gmail.com",
      to: email,
      subject: "Verificación de cuenta",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

const confirm_email_verify = async (req, res = response) => {
  var token_params = req.params["token"];
  var token = token_params.replace(/['"]+/g, "");
  var segment = token.split(".");

  if (segment.length != 3) {
    return res.status(403).send({ msg: "Invalid verify token" });
  } else {
    try {
      var payload = jwt.decode(token, "aranibar");
      await Customer.findByIdAndUpdate({ _id: payload.sub }, { verify: true });
      res.status(200).send({ data: true });
    } catch (error) {
      console.log(error);
      return res.status(200).send({ msg: "Expired verify token", data: undefined });
    }
  }
};

module.exports = {
  create_customer,
  read_customers,
  read_customer_by_id,
  update_customer,
  delete_customer,
  change_status,
  login_customer,
  confirm_email_verify,
};
