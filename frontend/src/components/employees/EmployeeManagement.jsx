import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeManagement({ onSave, employeeToEdit }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
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
    onSave(formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl text-gray-900"
      >
        <h2 className="text-2xl font-bold mb-6">
          {formData.id ? "Editar Empleado" : "Registrar Empleado"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handlePhoneChange}
              maxLength={12}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Sueldo</label>
            <input
              type="number"
              name="sueldo"
              value={formData.sueldo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Horario de Trabajo</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              placeholder="Ej: 9:00 - 18:00"
              required
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Fecha de Alta</label>
            <input
              type="date"
              name="fechaAlta"
              value={formData.fechaAlta}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {formData.id ? "Guardar Cambios" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
