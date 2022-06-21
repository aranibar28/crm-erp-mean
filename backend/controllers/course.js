const { response } = require("express");
const Course = require("../models/course");
const Cycle_Course = require("../models/cycles/cycle_course");
const Cycle_Instructor = require("../models/cycles/cycle_instructor");
const Cycle_Room = require("../models/cycles/cycle_room");
var path = require("path");
var fs = require("fs");

// localhost:3000/api/categories/image/default.png //
const image = async (req, res = response) => {
  let img = req.params["img"];
  fs.stat("./uploads/courses/" + img, (err) => {
    if (!err) {
      let path_img = "./uploads/courses/" + img;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = "./uploads/default.png";
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const create_course = async (req, res = response) => {
  let data = req.body;
  try {
    var exist_title = await Course.findOne({ title: data.title });
    if (exist_title) {
      return res.json({ data: undefined, msg: "Este título ya se encuentra registrado." });
    } else {
      var img_path = req.files["image"].path;
      var str_path = img_path.split("\\");
      var image_name = str_path[2];
      data.image = image_name;
      data.slug = data.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      let reg = await Course.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_courses = async (req, res = response) => {
  let reg = await Course.find().sort({ title: -1 });
  res.json({ data: reg });
};

const read_course_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Course.findById(id);
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const update_course = async (req, res = response) => {
  let id = req.params["id"];
  let course = await Course.findById(id);
  let { title, ...data } = req.body;

  try {
    if (course.title !== title) {
      var exist_title = await Course.findOne({ title });
      if (exist_title) {
        return res.json({ data: undefined, msg: "Este título ya se encuentra registrado." });
      }
    }

    data.title = title;
    data.slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    if (req.files) {
      var img_path = req.files.image.path;
      var name = img_path.split("\\");
      var image = name[2];
      let reg = await Course.findByIdAndUpdate(id, { ...data, image });
      fs.stat("./uploads/courses/" + reg.image, (err) => {
        if (!err) {
          fs.unlink("./uploads/courses/" + reg.image, (err) => {
            if (err) throw err;
          });
        }
      });
      res.json({ data: reg });
    } else {
      let reg = await Course.findByIdAndUpdate(id, data);
      res.send({ data: reg });
    }
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const delete_course = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Course.findByIdAndDelete(id);
    fs.stat("./uploads/courses/" + reg.image, (err) => {
      if (!err) {
        fs.unlink("./uploads/courses/" + reg.image, (err) => {
          if (err) throw err;
        });
      }
    });
    res.status(200).json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  var new_status = data.status ? false : true;
  reg = await Course.findByIdAndUpdate(id, { status: new_status });
  res.json({ data: reg });
};

const create_cycle = async (req, res = response) => {
  let data = req.body;
  try {
    let start_format = new Date(data.start_date + "T00:00:00");
    let final_format = new Date(data.final_date + "T23:59:59");
    let start_month = start_format.getMonth() + 1;
    let final_month = final_format.getMonth() + 1;

    // Obtener meses entre dos rangos de fechas
    let arr_months = [];
    if (start_month != final_month) {
      if (start_month >= final_month) {
        for (let i = start_month; i <= 12; i++) {
          arr_months.push(i);
        }
        for (let i = 1; i <= final_month; i++) {
          arr_months.push(i);
        }
      } else {
        for (let i = start_month; i <= final_month; i++) {
          arr_months.push(i);
        }
      }
    } else {
      arr_months.push(start_month);
    }

    // Calcular fecha de inscripción
    let init_date = start_format;
    init_date.setDate(init_date.getDate() - 15);
    let month;
    let day;

    if (init_date.getMonth() + 1 <= 9) {
      month = "0" + (init_date.getMonth() + 1);
    } else {
      month = init_date.getMonth() + 1;
    }

    if (init_date.getDate() + 1 <= 9) {
      day = "0" + (init_date.getDate() + 1);
    } else {
      day = init_date.getDate() + 1;
    }

    data.inscription = init_date.getFullYear() + "-" + month + "-" + day;
    data.months = arr_months;
    data.year = start_format.getFullYear();
    data.collaborator = req.id;

    let reg = await Cycle_Course.create(data);
    res.json({ data: reg });

    // Crear salones automáticamente
    let rooms = data.frequency;
    for (var item of rooms) {
      await Cycle_Room.create({
        room: item.room,
        frequency: item.frequency,
        start_time: item.start_time,
        final_time: item.final_time,
        aforo: item.aforo,
        course: data.course,
        cycle_course: reg._id,
        collaborator: data.collaborator,
      });
    }
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_cycle_by_id = async (req, res = response) => {
  let id = req.params["id"];
  let cycle = req.params["id_cycle"];

  try {
    let reg1 = await Course.findById(id);
    try {
      let reg2 = await Cycle_Course.findById({ _id: cycle });
      let rooms = await Cycle_Room.find({ cycle_course: cycle });
      res.json({ data: reg1, cycle: reg2, rooms: rooms });
    } catch (error) {
      res.json({ data: undefined, msg: error.message });
    }
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const read_current_cycles = async (req, res = response) => {
  let id = req.params["id"];

  let date = new Date();
  let year = date.getFullYear();
  let today_format = Date.parse(new Date()) / 1000;

  let cycles = await Cycle_Course.find({ course: id, year });
  var arr_cycles = [];

  for (var item of cycles) {
    let start_format = Date.parse(new Date(item.inscription + "T00:00:00")) / 1000;
    let final_format = Date.parse(new Date(item.final_date + "T00:00:00")) / 1000;
    if (today_format >= start_format && today_format <= final_format) {
      let rooms = await Cycle_Room.find({ cycle_course: item._id });
      arr_cycles.push({
        cycle: item,
        rooms: rooms,
      });
    }
  }
  res.json({ data: arr_cycles });
};

const read_expired_cycles = async (req, res = response) => {
  let id = req.params["id"];

  let date = new Date();
  let year = date.getFullYear();
  let today_format = Date.parse(new Date()) / 1000;

  let cycles = await Cycle_Course.find({ course: id, year });
  var arr_cycles = [];

  for (var item of cycles) {
    let final_format = Date.parse(new Date(item.final_date + "T00:00:00")) / 1000;
    if (today_format >= final_format) {
      let rooms = await Cycle_Room.find({ cycle_course: item._id });
      arr_cycles.push({
        cycle: item,
        rooms: rooms,
      });
    }
  }
  res.json({ data: arr_cycles });
};

const update_cycle = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  try {
    // Calcular fecha de inscripción
    let start_format = new Date(data.start_date + "T00:00:00");
    let final_format = new Date(data.final_date + "T23:59:59");
    let start_month = start_format.getMonth() + 1;
    let final_month = final_format.getMonth() + 1;

    // Obtener meses entre dos rangos de fechas
    let arr_months = [];
    if (start_month != final_month) {
      if (start_month >= final_month) {
        for (let i = start_month; i <= 12; i++) {
          arr_months.push(i);
        }
        for (let i = 1; i <= final_month; i++) {
          arr_months.push(i);
        }
      } else {
        for (let i = start_month; i <= final_month; i++) {
          arr_months.push(i);
        }
      }
    } else {
      arr_months.push(start_month);
    }

    let init_date = start_format;
    init_date.setDate(init_date.getDate() - 14);
    let month;
    let day;

    if (init_date.getMonth() + 1 <= 9) {
      month = "0" + (init_date.getMonth() + 1);
    } else {
      month = init_date.getMonth() + 1;
    }

    if (init_date.getDate() + 1 <= 9) {
      day = "0" + (init_date.getDate() + 1);
    } else {
      day = init_date.getDate() + 1;
    }

    data.inscription = init_date.getFullYear() + "-" + month + "-" + day;
    data.months = arr_months;

    let reg = await Cycle_Course.findByIdAndUpdate(id, data, { new: true });
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const add_rooms_cycle = async (req, res = response) => {
  let data = req.body;
  try {
    data.collaborator = req.id;
    let reg = await Cycle_Room.create(data);
    res.json({ data: reg });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const del_rooms_cycle = async (req, res = response) => {
  let id = req.params["id"];
  try {
    await Cycle_Room.findByIdAndDelete(id);
    res.status(200).json({ data: true });
  } catch (error) {
    res.json({ data: undefined, msg: error.message });
  }
};

const change_status_cycle = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  var new_status = data.status ? false : true;
  reg = await Cycle_Course.findByIdAndUpdate(id, { status: new_status });
  res.json({ data: reg });
};

module.exports = {
  image,
  create_course,
  read_courses,
  read_course_by_id,
  update_course,
  delete_course,
  change_status,
  create_cycle,
  read_cycle_by_id,
  read_current_cycles,
  read_expired_cycles,
  update_cycle,
  add_rooms_cycle,
  del_rooms_cycle,
  change_status_cycle,
};
