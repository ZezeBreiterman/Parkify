const { query } = require("express");
const express = require("express");
const { json } = require("express/lib/response");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcrypt');


const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.listen(8080, function () {
  console.log("Servidor escuchando en el puerto 8080");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123qwe123",
  database: "parkify_schema",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error al conectarse a la base de datos: " + err.stack);
    return;
  }
  console.log("Conexión establecida con la base de datos");
});

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/estacionamientos", (req, res) => {
  const sql = "SELECT * FROM estacionamientos";
  connection
    .promise()
    .query(sql)
    .then(([result, r2]) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/crearEstacionamiento", (req, res) => {
  console.log(req.body);
  const {
    nombre,
    direccion,
    lugares_totales,
    lugares_disponibles,
    hora_apertura,
    hora_cierre,
  } = req.body.form;
  const sql = `INSERT INTO estacionamientos (nombre, direccion, lugares_totales, lugares_disponibles, hora_apertura, hora_cierre) VALUES (
    '${nombre}',
    '${direccion}',
    '${lugares_totales}',
    '${lugares_disponibles}',
    '${hora_apertura}',
    '${hora_cierre}')`;
  console.log(sql);
  connection
    .promise()
    .query(sql)
    .then(res.send("Agregado!"))
    .catch((err) => {
      console.log(err);
      return res.send(err);
    });
});

app.post("/ocuparLugares", (req, res) => {
  console.log(req.body);
  const { id, cantidad } = req.body;
  const sql = `UPDATE estacionamientos SET lugares_disponibles = lugares_disponibles - '${cantidad}' WHERE id = '${idEstacionamiento}' AND `;
  connection
    .promise()
    .query(sql)
    .then(res.send(`se han ocupado ${cantidad} lugares`))
    .catch((err) => {
      console.log(err);
      return res.send(err);
    });
});

app.post("/crearUsuario", async(req, res) => {
  console.log(req.body);
  const { nombre, apellido, mail, telefono, contraseña} = req.body.form;
  const contraseñaHash = await bcrypt.hash(contraseña, 10);

  const sql = `INSERT INTO usuarios (nombre, apellido, mail, telefono, contraseña, tipo_usuario) VALUES (
    '${nombre}',
    '${apellido}',
    '${mail}',
    '${telefono}',
    '${contraseñaHash}',
    'user')`;
  connection
    .promise()
    .query(sql)
    .then(res.send("Usuario Agregado!"))
    .catch((err) => {
      console.log(err);
      return res.send(err);
    });
});


const ocuparLugar = (idEstacionamiento, cantidad) => {
  const sql = `UPDATE estacionamientos SET lugares_disponibles = lugares_disponibles - ${cantidad} WHERE id = ${idEstacionamiento}`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(
      `Se han ocupado ${cantidad} lugares en el estacionamiento con ID: ${idEstacionamiento}`
    );
  });
};
//ocuparLugar(1,20)

const desocuparLugar = (idEstacionamiento, cantidad) => {
  const sql = `UPDATE estacionamientos SET lugares_disponibles = lugares_disponibles + ${cantidad} WHERE id = ${idEstacionamiento}`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(
      `Se han desocupado ${cantidad} lugares en el estacionamiento con ID: ${idEstacionamiento}`
    );
  });
};
// desocuparLugar(1,20)

const getEstacionamientosAbiertos = () => {
  const sql =
    "SELECT * FROM estacionamientos WHERE hora_apertura < NOW() AND hora_cierre > NOW()";

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  });
};
//getEstacionamientosAbiertos()

