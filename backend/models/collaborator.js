const { Schema, model } = require("mongoose");

const CollaboratorSchema = Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  full_name:  { type: String, required: false },
  dni:        { type: String, required: false },
  phone:      { type: String, required: false },
  country:    { type: String, required: false },
  birthday:   { type: String, required: false },
  genre:      { type: String, required: false },
  role:       { type: String, required: true, default: "Administrador" },
  status:     { type: Boolean, required: true, default: true },
  created_at: { type: Date, required: true, default: Date.now },
});

CollaboratorSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Collaborator", CollaboratorSchema);
