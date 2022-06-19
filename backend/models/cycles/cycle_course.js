const { Schema, model } = require("mongoose");

const Cycle_CourseSchema = Schema({
  frequency:    { type: Object, required: true },
  nivel:        { type: String, required: true },
  sede:         { type: String, required: true },
  description:  { type: String, required: false },
  init_date:    { type: String, required: true },
  start_date:   { type: String, required: true },
  end_date:     { type: String, required: true },
  year:         { type: Number, required: true },
  price:        { type: Number, required: true },
  status:       { type: Boolean, required: true, default: false },
  course:       { type: Schema.Types.ObjectId, required: false, ref: "Course" },
  collaborator: { type: Schema.Types.ObjectId, required: false, ref: "Collaborator" },
  created_at:   { type: Date, required: true, default: Date.now },
});

Cycle_CourseSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Cycle_Course", Cycle_CourseSchema);
