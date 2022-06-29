const { response } = require("express");
const moment = require("moment");
const Inscription = require("../models/inscription");
const Inscription_Detail = require("../models/inscription_detail");
const Cycle_Room = require("../models/cycles/cycle_room");

var fs = require("fs");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const create_inscription = async (req, res = response) => {
  let data = req.body;
  try {
    data.advisor = req.id;
    data.day = moment().format("DD");
    data.month = moment().format("MM");
    data.year = moment().format("YYYY");

    let reg = await Inscription.create(data);

    for (let item of data.details) {
      item.advisor = req.id;
      item.customer = data.customer;
      item.inscription = reg._id;
      item.day = data.day = moment().format("DD");
      item.month = data.month = moment().format("MM");
      item.year = data.year = moment().format("YYYY");
      await Inscription_Detail.create(item);
      update_aforo(item.cycle_room);
    }
    send_email_invoice(reg._id);
    res.status(200).send({ data: true });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_inscriptions_today = async (req, res = response) => {
  try {
    let day = moment().format("DD");
    let month = moment().format("MM");
    let year = moment().format("YYYY");

    let reg = await Inscription.find({ day, month, year }).populate("customer").populate("advisor").sort({ created_at: -1 });
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_inscriptions_dates = async (req, res = response) => {
  try {
    let advisor = req.params["advisor"];
    let from = req.params["from"];
    let to = req.params["to"];
    let reg = [];

    if (advisor == "all") {
      reg = await Inscription.find({
        created_at: {
          $gte: new Date(from + "T00:00:00"),
          $lte: new Date(to + "T23:59:59"),
        },
      })
        .populate("customer")
        .populate("advisor")
        .sort({ created_at: -1 });
    } else {
      reg = await Inscription.find({
        created_at: {
          $gte: new Date(from + "T00:00:00"),
          $lte: new Date(to + "T23:59:59"),
        },
        advisor,
      })
        .populate("customer")
        .populate("advisor")
        .sort({ created_at: -1 });
    }

    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

////////////////////////////////////////////////////////

const update_aforo = async (id) => {
  let room = await Cycle_Room.findById(id);
  let new_aforo = room.students + 1;
  await Cycle_Room.findByIdAndUpdate(id, { students: new_aforo });
};

const send_email_invoice = async (id) => {
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
        pass: "crgswynloywvucho",
      },
    })
  );

  //OBTENER MATRICULA
  let inscription = await Inscription.findById(id).populate("customer").populate("advisor");
  let details = await Inscription_Detail.find({ inscription: id }).populate("course").populate("cycle_course").populate("cycle_room");
  let created_at = moment(inscription.created_at).format("DD/MM/YYYY");

  readHTMLFile(process.cwd() + "/mails/electronic_invoice.html", (err, html) => {
    let rest_html = ejs.render(html, { inscription, details, created_at });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: "aranibargerson28@gmail.com",
      to: inscription.customer.email,
      subject: "Orden de Matrícula",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

const test_send_invoice = async (req, res = response) => {
  send_email_invoice("62bb64b7cb430464c6fef3c2");
  res.status(200).send({ data: true });
};

module.exports = {
  create_inscription,
  read_inscriptions_today,
  read_inscriptions_dates,
};
