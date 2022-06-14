const { Schema, model } = require("mongoose");

const CustomerSchema = Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  full_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  dni:        { type: String, required: false },
  phone:      { type: String, required: false },
  genre:      { type: String, required: false },
  birthday:   { type: String, required: false },
  country:    { type: String, required: false },
  city:       { type: String, required: false },
  status:     { type: Boolean, required: true, default: true },
  verify:     { type: Boolean, required: true, default: false },
  type:       { type: String, required: true, default: "Prospecto" },
  advisor:    { type: Schema.Types.ObjectId, required: false, ref: "Collaborator" },
  created_at: { type: Date, required: true, default: Date.now },
});

CustomerSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer", CustomerSchema);
