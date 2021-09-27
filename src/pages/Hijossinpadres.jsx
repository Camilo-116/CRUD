import { React, useState, useEffect } from "react";
import "../styles/Consultas.css";
import Axios from "axios";

const Hijossinpadres = () => {
  const [hijos, setHijos] = useState([]);
  async function reload() {
    Axios.get("http://localhost:3004/hijos")
      .then((response) => {
        console.log("RESPONSE FROM SERVER", response.data);
        setHijos(response.data);
      })
      .catch((err) => {
        console.log("ERROR ON GET HIJOS ");
        console.error(err);
      });
  }
  useEffect(() => {
    reload();
  }, []);
  return (
    <div className="main2">
      <h1>Hijos sin padre </h1>
      <ul>
        {hijos.map((file) => {
          return (
            <li>
              <div>
                <span>Tarjeta de Identidad</span>
                <span>{file.tarjetaIdentidad}</span>
              </div>
              <div>
                <span>Primer Nombre</span>
                <span>{file.primerNombre}</span>
              </div>
              <div>
                <span>Segundo Nombre</span>
                <span>{file.segundoNombre}</span>
              </div>
              <div>
                <span>Género</span>
                <span>{file.genero}</span>
              </div>
              <div>
                <span>Fecha de nacimiento</span>
                <span>{file.fechadenacimiento}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Hijossinpadres;
