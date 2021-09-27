import  React from "react";
import "../styles/Consultas.css";

const Padressinhijos = ({ titleConsult, data }) => {

  return (
    <div className='main2'>
      <h1>Padres sin hijos</h1>
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



export default Padressinhijos;