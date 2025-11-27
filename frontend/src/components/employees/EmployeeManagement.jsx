import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService.js";

// --- Funciones de formateo para el sueldo ---
function formatearSueldoVisual(valor) {
  if (!valor) return "";
  return "$ " + Number(valor).toLocaleString("es-AR");
}

function limpiarSueldo(valor) {
  return valor.replace(/\./g, "").replace("$", "").replace(" ", "");
}

export default function EmployeeManagement() {
  const navigate = useNavigate();

  // Alterna entre vista "lista" y vista "formulario"
  const [view, setView] = useState("list"); // list | form
  const [employees, setEmployees] = useState([]);

  // Formulario
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    tipo_documento: 1,
    nro_documento: "",
    fecha_nac: "",
    mail: "",
    telefono: "",
    sueldo: "",
    horario: "",
    fechaAlta: new Date().toISOString().split("T")[0],
  });

  // Cargar empleados al iniciar
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error("Error cargando empleados:", err);
    }
  };

  // Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Teléfono con formato
  const formatPhoneNumber = (value) => {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length <= 3) return numeric;
    if (numeric.length <= 6) return `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
    return `${numeric.slice(0, 3)}-${numeric.slice(3, 6)}-${numeric.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, telefono: formatted }));
  };

  // Guardar empleado
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      persona: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        mail: formData.mail,
        telefono: formData.telefono,
        fecha_nac: formData.fecha_nac,
        tipo_documento: formData.tipo_documento,
        nro_documento: formData.nro_documento,
      },
      usuario: {
        user_name: formData.mail,
        password: formData.nro_documento,
        id_permiso: 2,
      },
      role: {
        sueldo: formData.sueldo,
        horario: formData.horario,
        fecha_alta: formData.fechaAlta,
      },
    };

    try {
      await employeeService.createOrUpdate(payload, formData.id);
      await loadEmployees();
      setView("list");
    } catch (error) {
      console.error("Error guardando empleado:", error);
    }
  };

  // Cargar datos para editar
  const handleEdit = (emp) => {
    setFormData({
      id: emp.id,
      nombre: emp.nombre,
      apellido: emp.apellido,
      tipo_documento: emp.tipo_documento,
      nro_documento: emp.nro_documento,
      fecha_nac: emp.fecha_nac ? emp.fecha_nac.split("T")[0] : "",
      mail: emp.mail,
      telefono: emp.telefono,
      sueldo: emp.sueldo,
      horario: emp.horario,
      fechaAlta: emp.fecha_alta ? emp.fecha_alta.split("T")[0] : "",
    });

    setView("form");
  };

  // Nuevo empleado → formulario vacío
  const handleNew = () => {
    setFormData({
      id: null,
      nombre: "",
      apellido: "",
      tipo_documento: 1,
      nro_documento: "",
      fecha_nac: "",
      mail: "",
      telefono: "",
      sueldo: "",
      horario: "",
      fechaAlta: new Date().toISOString().split("T")[0],
    });

    setView("form");
  };

  // Volver
  const handleCancel = () => {
    setView("list");
  };

  // -------------------------------------------------------
  //                 VISTA 1 — LISTADO
  // -------------------------------------------------------
  if (view === "list") {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Empleados</h1>

          <button
            onClick={handleNew}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            + Nuevo Empleado
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id_empleado}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-2">
                {emp.nombre} {emp.apellido}
              </h2>

              <p><strong>DNI:</strong> {emp.nro_documento}</p>
              <p><strong>Email:</strong> {emp.mail}</p>
              <p><strong>Teléfono:</strong> {emp.telefono}</p>
              <p><strong>Sueldo:</strong> ${emp.sueldo}</p>
              <p><strong>Horario:</strong> {emp.horario}</p>
              <p><strong>Fecha Alta:</strong> {new Date(emp.fecha_alta).toLocaleDateString("es-AR")}</p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => handleEdit(emp)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✏ Editar
                </button>

                <button
                  onClick={() => console.log("eliminar")}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  //                 VISTA 2 — FORMULARIO
  // -------------------------------------------------------
  return (
    <div className="flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-6">
          {formData.id ? "Editar Empleado" : "Registrar Empleado"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* --- Inputs normales (los dejé igual que tus originales) --- */}

          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Documento</label>
            <input
              type="text"
              name="nro_documento"
              value={formData.nro_documento}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Tipo Documento</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value={1}>DNI</option>
              <option value={2}>Pasaporte</option>
            </select>
          </div>

          <div>
            <label>Fecha Nacimiento</label>
            <input
              type="date"
              name="fecha_nac"
              value={formData.fecha_nac}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handlePhoneChange}
              maxLength={12}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Sueldo</label>
            <input
              type="text"
              name="sueldo"
              value={formatearSueldoVisual(formData.sueldo)}
              onChange={(e) => {
                const limpio = limpiarSueldo(e.target.value);
                if (!isNaN(limpio)) {
                  setFormData({ ...formData, sueldo: limpio });
                }
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label>Horario</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ej: 09:00 - 18:00"
            />
          </div>

          <div>
            <label>Fecha Alta</label>
            <input
              type="date"
              name="fechaAlta"
              value={formData.fechaAlta}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            {formData.id ? "Guardar Cambios" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
