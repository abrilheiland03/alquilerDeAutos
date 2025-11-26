import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

// --- Funciones de formateo para el sueldo ---
function formatearSueldoVisual(valor) {
  if (!valor) return "";
  return "$ " + Number(valor).toLocaleString("es-AR");
}

function limpiarSueldo(valor) {
  return valor.replace(/\./g, "").replace("$", "").replace(" ", "");
}

export default function EmployeeManagement({ onSave, employeeToEdit }) {
  const navigate = useNavigate();
  const { user, isAdmin, isEmployee, isClient } = useAuth();

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    tipo_documento: 1,
    nro_documento: "",
    fecha_nac:"",
    mail: "",
    telefono: "",
    sueldo: "",
    horario: "",
    fechaAlta: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        fechaAlta: employeeToEdit.fechaAlta
          ? employeeToEdit.fechaAlta.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      persona: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        mail: formData.mail,
        telefono: formData.telefono,
        fecha_nac: formData.fecha_nac,
        tipo_documento: formData.tipo_documento,
        nro_documento: formData.nro_documento
      },
      usuario: {
        user_name: formData.mail,
        password: formData.nro_documento,
        id_permiso: 2
      },
      role: {
        sueldo: formData.sueldo,
        horario: `${formData.horaInicio} - ${formData.horaFin}`,
        fecha_alta: formData.fechaAlta
      }
    };

    onSave(payload);
    navigate("/dashboard");
  };


  return (
    <>
    {isAdmin() && (
    <div className="flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl text-gray-900 dark:text-white transition-colors duration-200"
      >
        <h2 className="text-2xl font-bold mb-6">
          {formData.id ? "Editar Empleado" : "Registrar Empleado"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="Ingresa el nombre"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="Ingresa el apellido"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Número de Documento</label>
            <input
              type="text"
              name="nro_documento"
              value={formData.nro_documento}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Tipo de Documento
            </label>

            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={1}>DNI</option>
              <option value={2}>Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
              Fecha Nacimiento
            </label>
            <input
              type="date"
              name="fecha_nac"
              value={formData.fecha_nac || ""}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="empleado@ejemplo.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handlePhoneChange}
              maxLength={12}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="351-123-4567"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Sueldo</label>
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
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700
                        text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="$ 0"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Horario de Trabajo</label>

            <div className="flex gap-2">
              <input
                type="time"
                name="horaInicio"
                value={formData.horaInicio || ""}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />

              <span className="self-center">a</span>

              <input
                type="time"
                name="horaFin"
                value={formData.horaFin || ""}
                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Fecha de Alta</label>
            <input
              type="date"
              name="fechaAlta"
              value={formData.fechaAlta}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            {formData.id ? "Guardar Cambios" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  )}
  </>
);
}