import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../services/employeeService.js";
import { FileText, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react";

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

  //errores
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage(""); // Limpiar error si todo salió bien
    } catch (error) {
      console.error("Error guardando empleado:", error);

      // Mostrar mensaje específico si es mail duplicado
      if (error?.response?.data?.error?.includes("mail")) {
        setErrorMessage("El mail ingresado ya se encuentra registrado.");
      } else {
        setErrorMessage("Error al guardar el empleado. Verifique los datos.");
      }
    }
  };


  // Cargar datos para editar
  const handleEdit = (emp) => {
    setFormData({
      id: emp.id_empleado, // <-- usar id_empleado aquí
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

  // Eliminar empleado
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    try {
      await employeeService.delete(id);
      await loadEmployees(); // recargar lista
    } catch (error) {
      console.error("Error eliminando empleado:", error);

      alert(
        error?.response?.data?.error ||
        "No se pudo eliminar. Puede tener alquileres asociados."
      );
    }
  };

  // Volver
  const handleCancel = () => {
    setView("list");
  };

  // Estadisticas
  const getEmployeesStats = () => {
  const total = employees.length;

  const newThisMonth = employees.filter(emp => {
  if (!emp.fecha_alta) return false;
  const empDate = new Date(emp.fecha_alta);
  const today = new Date();
  return empDate.getMonth() === today.getMonth() &&
  empDate.getFullYear() === today.getFullYear();
  }).length;

  const withDNI = employees.filter(emp => emp.tipo_documento === 1).length;
  const withPassport = employees.filter(emp => emp.tipo_documento === 2).length;

  return { total, newThisMonth, withDNI, withPassport };
  };

  const [stats, setStats] = useState({
  total: 0,
  newThisMonth: 0,
  withDNI: 0,
  withPassport: 0
  });

  useEffect(() => {
  setStats(getEmployeesStats());
  }, [employees]);

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

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Empleados</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{stats.newThisMonth}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Nuevos este mes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.withDNI}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Con DNI</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.withPassport}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Con Pasaporte</div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id_empleado}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {emp.nombre} {emp.apellido}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <FileText className="h-4 w-4 mr-1" />
                      DNI: {emp.nro_documento}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="status-badge bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Empleado #{emp.id_empleado}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Desde {new Date(emp.fecha_alta).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* Información del empleado */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{emp.mail}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{emp.telefono}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      Sueldo: ${emp.sueldo} • Horario: {emp.horario}
                    </span>
                  </div>
                </div>

                {/* Fecha de Alta */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Fecha de alta:</span>
                  <span className="font-medium">{new Date(emp.fecha_alta).toLocaleDateString("es-AR")}</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-1"></div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors duration-200"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(emp.id_empleado)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
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
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label>Tipo Documento</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>

          <div>
            <label>Horario</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-900"
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
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>
        </div>
        
        {/* Mostrar mensaje de error si existe */}
        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium">
            {errorMessage}
          </div>
        )}

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