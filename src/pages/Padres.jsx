import Table from "../Components/Table";
import { React, useState, useEffect } from "react";
import background from "../images/background1.svg";
import "../styles/Forms.css";
import Axios from "axios";

export const Padres = () => {
  //DATA FROM or TO SERVER
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState(0);
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  //LOGIC
  const [listaPadres, setListaPadres] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  function handleUpdateUser(user) {
    let correctedDateUser = user.fechaNacimiento;
    correctedDateUser = correctedDateUser.substring(
      0,
      correctedDateUser.indexOf("T")
    );
    setUpdatedUser({ ...user, fechaNacimiento: correctedDateUser });
    setNeedUpdate(true);
    console.log("UPDATING THE USER: ", updatedUser);
  }
  const addPadre = () => {
    Axios.post("http://localhost:8888/crearpadre", {
      cedula,
      primerNombre,
      segundoNombre,
      apellido,
      genero,
      direccion,
      ciudad,
      fechaNacimiento,
    }).then((response) => {
      console.log("Success");
      setListaPadres([
        ...listaPadres,
        {
          cedula,
          primerNombre,
          segundoNombre,
          apellido,
          genero,
          direccion,
          ciudad,
          fechaNacimiento,
        },
      ]);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      Axios.get("http://localhost:8888/padres")
        .then((response) => {
          console.log("RESPONSE FROM SERVER", response.data);

          setListaPadres(response.data);
        })
        .catch((err) => {
          console.log("ERROR ON GET PADRES ");
          console.error(err);
        });
    };
    fetchData();
    // getPadres();
  }, []);
  const registrar = (e) => {
    e.preventDefault();
    console.log("Procesando registro");
    addPadre();
  };

  return (
    <main className="container">
      <form className="data-form" onSubmit={registrar}>
        <label htmlFor="nombre">Primer Nombre</label>
        <input
          type="text"
          id="nombre"
          value={primerNombre || "" || updatedUser.primerNombre}
          name="nombre"
          onChange={(e) => setPrimerNombre(e.target.value)}
          placeholder="Tu nombre"
        />
        <label htmlFor="segundoNombre">Segundo Nombre</label>
        <input
          type="text"
          id="segundoNombre"
          value={segundoNombre || "" || updatedUser.segundoNombre}
          name="segundoNombre"
          onChange={(e) => setSegundoNombre(e.target.value)}
          placeholder="Segundo Nombre"
        />
        <label htmlFor="apellido">Apellidos</label>
        <input
          type="text"
          id="apellido"
          value={apellido || "" || updatedUser.apellido}
          name="apellido"
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Escribe tus apellidos"
        />
        <label htmlFor="ciudad">ciudad</label>
        <input
          type="city"
          id="ciudad"
          value={ciudad || "" || updatedUser.ciudad}
          name="ciudad"
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Escribe tu ciudad"
        />
        <label htmlFor="direccion">direccion</label>
        <input
          type="address"
          id="direccion"
          value={direccion || "" || updatedUser.direccion}
          name="direccion"
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="La direccion de residencia"
        />

        <label htmlFor="id">Cedula</label>
        <input
          type="number"
          id="cedula"
          value={cedula || 0 || parseInt(updatedUser.cedula)}
          onChange={(e) => setCedula(e.target.value)}
          name="cedula"
          placeholder="Ingrese la cedula"
          disabled={!needUpdate}
        />
        <div>
          <div className="special-form">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              value={fechaNacimiento || "" || updatedUser.fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              name="fechaNacimiento"
              placeholder="Seleccione una fecha"
            />
          </div>
          <div>
            <label htmlFor="fechaNacimiento">Genero</label>
            <select name="genero" id="genero">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        <input type="submit" value="ENVIAR"></input>
        <button className="button-update" disabled={!needUpdate}>
          ACTUALIZAR
        </button>
        <img src={background} alt="" className="background" />
      </form>
      <div className="table">
        <Table
          tableheads={[
            "Acciones",
            "CEDULA",
            "Nombre de pila",
            "Segundo nombre",
            "Apellido",
            "Genero",
            "Direccion",
            "Ciudad",
            "Edad",
          ]}
          data={listaPadres}
          setNeedUpdate={setNeedUpdate}
          handleUpdateUser={handleUpdateUser}
        />
      </div>
    </main>
  );
};
