const { Schema, model } = require("mongoose");

const Customer_TaskSchema = Schema({
  date:         { type: String, required: true },
  note:         { type: String, required: true },
  type:         { type: String, required: true },
  status:       { type: Boolean, required: true },
  customer:     { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  advisor:      { type: Schema.Types.ObjectId, required: false, ref: "Collaborator" },
  advisor_make: { type: Schema.Types.ObjectId, required: false, ref: "Collaborator" },
  created_at:   { type: Date, required: true, default: Date.now },
});

Customer_TaskSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer_Task", Customer_TaskSchema);