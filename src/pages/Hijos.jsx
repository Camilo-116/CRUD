import React from "react";
import "../styles/Forms.css";
import Table from "../Components/Table";
export const Hijos = () => {
  return (
    <main className="container">
      <form className="data-form">
        <label htmlFor="fname">Nombre completo</label>
        <input
          type="text"
          id="fname"
          name="firstname"
          placeholder="Your name.."
        />

        <label htmlFor="idPadre">ID Hijo</label>
        <input
          type="number"
          id="idPadre"
          name="lastname"
          placeholder="Ingrese el ID"
        />
        <label htmlFor="idHijo">Hijo de </label>
        <select id="progenitor" name="progenitor">
          <option value="dinamico">dkinamico</option>
        </select>
        <input type="submit" value="ENVIAR"></input>
      </form>
      <Table />
    </main>
  );
};
