const { response } = require("express");
const Course = require("../models/course");
var path = require("path");
var fs = require("fs");

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
  let { ...data } = req.body;

  try {
    var exist_title = await Course.findOne({ title: data.title });
    if (exist_title) {
      return res.json({ data: undefined, msg: "Este título ya se encuentra registrado." });
    } else {
      data.slug = data.title
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

module.exports = {
  create_course,
  read_courses,
  read_course_by_id,
  update_course,
  delete_course,
  change_status,
  image,
};
