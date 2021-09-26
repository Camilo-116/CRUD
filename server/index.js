const express = require("express");
const app = express();
const mariadb = require("mariadb");
const cors = require("cors");
const port = 8888;
const pool = mariadb.createPool({
  user: "root",
  host: "winhost",
  password: "010717",
  database: "icbf",
});

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
  const cedula = req.body.cedula;
  const userData = req.body.userData;
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
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${table}`);
    // console.log(rows);
    conn.end();
    return rows;
  } catch (error) {
    throw error;
  }
}

async function insertData(table, values) {
  let conn;
  try {
    conn = await pool.getConnection();
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
