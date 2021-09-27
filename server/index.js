const express = require("express");
const app = express();
const mariadb = require("mariadb");

const cors = require("cors");

const config = mariadb.createPool({
  host: "winhost",
  user: "root",
  password: "010717",
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

async function updateHijo(primaryKey, data) {
  let conn;
  try {
    conn = await config.getConnection();
    const results = await conn.query(
      `UPDATE hijo SET primerNombre = ?, segundoNombre = ? , genero = ? , fechaNacimiento = ?, hijoDe = ? WHERE tarjetaIdentidad = ${primaryKey.toString()};`,
      data
    );

    conn.end();
    return results;
  } catch (error) {
    throw error;
  }
}

const { default: axios } = require("axios");

const port = 3004;

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
async function insertHijo(table, values) {
  let conn;
  try {
    conn = await config.getConnection();
    const res = await conn.query(
      `INSERT INTO ${table} VALUES (?,?,?,?,?,?)`,
      values
    );
    conn.end();
    return res;
  } catch (error) {
    throw error;
  }
}
app.post("/crearhijo", (req, res) => {
  const {
    tarjetaIdentidad,
    primerNombre,
    segundoNombre,
    genero,
    hijode,
    fechaNacimiento,
  } = req.body;

  const response = insertHijo(
    "hijo(tarjetaIdentidad, primerNombre, segundoNombre, genero, fechaNacimiento, hijode)",
    [
      tarjetaIdentidad,
      primerNombre,
      segundoNombre,
      genero,
      fechaNacimiento,
      hijode || null,
    ]
  )
    .then((response) => {
      console.log("HIJO INSERTADO CORRECTAMENTE");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("ERROR INSERTANDO HIJO");
      console.error(err);
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

app.put("/updateHijo", (req, res) => {
  const {
    tarjetaIdentidad,
    primerNombre,
    segundoNombre,
    genero,
    hijode,
    fechaNacimiento,
    updatedUser,
  } = req.body;
  updateHijo(updatedUser.tarjetaIdentidad.toString(), [
    primerNombre,
    segundoNombre,
    genero,
    fechaNacimiento,
    hijode,
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

app.get("/hijos", (req, res) => {
  const results = getData("hijo");
  results
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR ON SERVER getting hijos");
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
