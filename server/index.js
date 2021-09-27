const express = require("express");
const app = express();
const mariadb = require("mariadb");

const cors = require("cors");

const config = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "Josemicod5",
  database: "icbf",
  connectionLimit: 5,
  acquireTimeout: 300,
});

async function updatePadre(primaryKey, data) {
  let conn;
  try {
    conn = await config.getConnection();
    const results = await conn.query(
      `UPDATE padre SET primerNombre = ?, segundoNombre = ? , apellido = ?, genero = ? , direccion = ?, ciudad = ?, fechaNacimiento = ? WHERE cedula = ${primaryKey.toString()};`,
      data
    );

    conn.end();
    return results;
  } catch (error) {
    throw error;
  }
}

const {
  default: axios
} = require("axios");

const port = 8888;

app.use(cors());
app.use(express.json());

app.post("/crearpadre", (req, res) => {
  const primerNombre = req.body.primerNombre;
  const segundoNombre = req.body.segundoNombre;
  const apellido = req.body.apellido;
  const genero = req.body.genero;
  const direccion = req.body.direccion;
  const ciudad = req.body.ciudad;
  const fechaNacimiento = req.body.fechaNacimiento;
  const cedula = req.body.cedula;

  const response = insertData(
    "padre(cedula, primerNombre, segundoNombre, apellido, genero, direccion, ciudad, fechaNacimiento)",
    [
      cedula,
      primerNombre,
      segundoNombre,
      apellido,
      genero,
      direccion,
      ciudad,
      fechaNacimiento,
    ]
  );
  response
    .then((data) => {
      console.log("VALUES INSERTED");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("ERROR INSERTING DATA");
      console.log(err);
    });
});

app.put("/update", (req, res) => {
  const {
    cedula,
    primerNombre,
    segundoNombre,
    apellido,
    genero,
    direccion,
    ciudad,
    fechaNacimiento,
    updatedUser,
  } = req.body;
  updatePadre(updatedUser.cedula.toString(), [
      primerNombre,
      segundoNombre,
      apellido,
      genero,
      direccion,
      ciudad,
      fechaNacimiento,
    ])
    .then((response) => {
      console.log("ACTUALIZADO CORRECTAMENTE EL USUARIO ", primerNombre);
    })
    .catch((err) => {
      console.log("ERROR ACTUALIZANDO");
      console.log(err);
    });
});

app.get("/padres", (req, res) => {
  const results = getData("padre");
  results
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR ON SERVER");
      console.log(error);
      res.status(500);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// async function updateData(table, primaryKey, data) {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const results = await conn.query(`UPDATE ${table} SET ?`);
//     // console.log(rows);
//     conn.end();
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }

async function getData(table) {
  let conn;
  try {
    conn = await config.getConnection();
    const rows = await conn.query(`SELECT * FROM ${table}`);
    conn.end();
    return rows;
  } catch (error) {
    throw error;
  }
}

async function insertData(table, values) {
  let conn;
  try {
    conn = await config.getConnection();
    const res = await conn.query(
      `INSERT INTO ${table} VALUES (?,?,?,?,?,?,?,?)`,
      values
    );
    conn.end();
    return res;
  } catch (error) {
    throw error;
  }
}