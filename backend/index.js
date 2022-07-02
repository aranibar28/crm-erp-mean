const express = require("express");
const cors = require("cors");
const { db_connection } = require("./database/config");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

db_connection();

// Rutas API
app.use("/api/collaborator", require("./routes/collaborator"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/prospect", require("./routes/prospect"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/inscriptions", require("./routes/inscription"));
app.use("/api/payments", require("./routes/payments"));

app.listen(port, () => {
  console.log("Servidor corriendo Puerto: " + port);
});
