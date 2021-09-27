import  React from "react";
import "../styles/Consultas.css";

const Hijossinpadres = ({ titleConsult, data }) => {

  return (
    <div className='main2'>
      <h1>Hijos sin padre </h1>
      <ul>
        {data.map((file) => {
          return (
            <li>
              {file.id} {file.nombre}
            </li>
          );
        })}
      </ul>
    </div>
  );
};



export default Hijossinpadres;