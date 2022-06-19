const { Schema, model } = require("mongoose");

const Cycle_InstructorSchema = Schema({
  frequency:     { type: Object, required: true },
  room:          { type: String, required: true },
  start_time:    { type: String, required: true },
  end_time:      { type: String, required: true },
  total_aforo:   { type: Number, required: true },
  current_aforo: { type: Number, required: true, default: 0 },
  course:        { type: Schema.Types.ObjectId, required: false, ref: "Course" },
  cycle_course:  { type: Schema.Types.ObjectId, required: false, ref: "Cycle_Course" },
  created_at:    { type: Date, required: true, default: Date.now },
});

Cycle_InstructorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Cycle_Instructor", Cycle_InstructorSchema);
