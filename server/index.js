const express = require("express");
const app = express();
const mariadb = require("mariadb");
const querySelector = require("./querys")

const cors = require("cors");

const config = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "Dhit27979781",
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

async function deletePadre(cedula) {
  let conn;
  try {
    conn = await config.getConnection();
    const result = await conn.query(
      `DELETE FROM padre WHERE cedula = ${cedula.toString()}`,
      
    );
    conn.end();
    return result;
  } catch (error) {
   
  }
}

async function deleteHijo(tarjetaIdentidad) {
  let conn;
  try {
    conn = await config.getConnection();
    const result = await conn.query(
      `DELETE FROM hijo WHERE tarjetaIdentidad = ${tarjetaIdentidad.toString()}`,
      
    );
    conn.end();
    return result;
  } catch (error) {
   
  }
}


app.get("/:name(c1|c2|c3)", (req,res) => {
  var type = req.params.name[1];
  const results = getQuery(type);
  results
    .then((data) =>{
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR ON SERVER n");
      console.log(error);
      res.status(500);
    }); 
});

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
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("ERROR ACTUALIZANDO");
      console.log(err);
      res.sendStatus(500);
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
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("ERROR ACTUALIZANDO");
      console.log(err);
      res.sendStatus(500);
    });
});

app.get("/padres", (req, res) => {
  const results = getData("padre");
  results
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log("ERROR ON SERVER p");
      console.log(error);
      res.status(500);
    });
});

app.get("/padres/:cedula", (req, res) => {
  const cedula = req.params.cedula;
  const results = getDataC1("hijo",cedula);
  results
    .then((data) => {
      res.send(data);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("ERROR ON SERVER c");
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

app.delete("/deletepadre/:cedula", (req, res) => {
  console.log("ENTRE");
  const cedula = req.params.cedula;
  const response = deletePadre(cedula);
  response
    .then((result) => {
      console.log("ELIMINADO CORRECTAMENTE EL PADRE: ", cedula);
      res.send(200);
    })
    .catch((err) => {
      console.log("Error eliminando a ", cedula);
      console.log(err);
      res.send(500);
    });
});

app.delete("/deletehijo/:tarjetaIdentidad", (req, res) => {
  console.log("ENTRE");
  const tarjetaIdentidad = req.params.tarjetaIdentidad;
  const response = deleteHijo(tarjetaIdentidad);
  response
    .then((result) => {
      console.log("ELIMINADO CORRECTAMENTE EL PADRE: ", tarjetaIdentidad);
      res.send(200);
    })
    .catch((err) => {
      console.log("Error eliminando a ", tarjetaIdentidad);
      console.log(err);
      res.send(500);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

async function getDataC1(table,cedula) {
  let conn;
  try {
    conn = await config.getConnection();
    const rows = await conn.query(`SELECT * FROM ${table} WHERE hijode = ${cedula.toString()}`);
    conn.end();
    return rows;
  } catch (error) {}
}

async function getQuery(type){
  let conn;
  try{
    conn = await config.getConnection();
    const rows = await conn.query(querySelector(type))
    conn.end();
    return rows;
  }catch(error){
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
    throw error
  }
}