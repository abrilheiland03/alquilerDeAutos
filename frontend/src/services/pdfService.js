// services/pdfService.js
import { reportService } from './reportService';
import { chartService } from './chartService';
import { logoService } from './logoService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ FUNCIÓN AUXILIAR PARA AGREGAR HEADER A TODOS LOS PDFs
async function addHeaderToPDF(doc, dateRange) {
  try {
    // Cargar logo
    const logoImage = await logoService.loadLogoAsBase64();
    
    if (logoImage) {
      // Agregar logo (ajusta el tamaño según necesites)
      doc.addImage(logoImage, 'PNG', 14, 10, 30, 15);
    }
    
    // Agregar fecha de emisión (arriba a la derecha)
    const currentDate = logoService.getCurrentDateFormatted();
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de emisión: ${currentDate}`, 180, 15, { align: 'right' });
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 28, 196, 28);
    
  } catch (error) {
    console.warn('No se pudo cargar el logo, continuando sin él:', error);
  }
}



export const pdfService = {
  // Generar PDF de detalle de alquileres por cliente
  generateClientRentalsPDF: async (dateRange, periodo = 'mensual') => {
    try {
      // Obtener datos del backend
      const [clientesData, periodoData, facturacionData, rankingData] = await Promise.all([
        reportService.getClientRentalsPDF(dateRange.start, dateRange.end),
        reportService.getRentalsByPeriodPDF(dateRange.start, dateRange.end, periodo),
        reportService.getMonthlyRevenuePDF(dateRange.start, dateRange.end),
        reportService.getVehicleRankingPDF(dateRange.start, dateRange.end)
      ]);

      // Crear PDF
      const doc = new jsPDF();
      
      // ✅ AGREGAR LOGO Y FECHA EN EL HEADER
      await addHeaderToPDF(doc, dateRange);
      
      // Configuración inicial
      doc.setFont('helvetica');
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      
      // Título principal (ajustado por el header)
      doc.text('REPORTE COMPLETO DE ALQUILERES', 105, 45, { align: 'center' });
      
      // Información del período
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, 105, 55, { align: 'center' });
      doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 105, 60, { align: 'center' });
      
      let yPosition = 70;

      // 1. RESUMEN EJECUTIVO
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('1. RESUMEN EJECUTIVO', 14, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const totalClientes = clientesData.length;
      const totalIngresos = clientesData.reduce((sum, cliente) => sum + (cliente.total_facturado || 0), 0);
      const totalAlquileres = periodoData.reduce((sum, periodo) => sum + (periodo.total_alquileres || 0), 0);
      const vehiculoTop = rankingData[0] || {};
      
      doc.text(`• Total de clientes activos: ${totalClientes}`, 20, yPosition);
      yPosition += 6;
      doc.text(`• Ingresos totales: $${totalIngresos.toLocaleString('es-AR')}`, 20, yPosition);
      yPosition += 6;
      doc.text(`• Total de alquileres: ${totalAlquileres}`, 20, yPosition);
      yPosition += 6;
      doc.text(`• Vehículo más popular: ${vehiculoTop.modelo || 'N/A'} (${vehiculoTop.cantidad_alquileres || 0} alquileres)`, 20, yPosition);
      yPosition += 15;

      // 2. DETALLE DE ALQUILERES POR CLIENTE (Tabla)
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('2. DETALLE POR CLIENTE', 14, yPosition);
      yPosition += 10;

      const clientesTableData = clientesData.map(cliente => [
        cliente.cliente,
        cliente.nro_documento || 'N/A',
        cliente.total_alquileres,
        `$${(cliente.total_facturado || 0).toLocaleString('es-AR')}`,
        `${(cliente.duracion_promedio || 0).toFixed(1)} días`,
        cliente.ultimo_alquiler ? new Date(cliente.ultimo_alquiler).toLocaleDateString('es-AR') : 'N/A'
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Cliente', 'Documento', 'Total Alq.', 'Ingresos', 'Duración Prom.', 'Último Alq.']],
        body: clientesTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // 3. RANKING DE VEHÍCULOS (Tabla) - MODIFICADO
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('3. RANKING DE VEHÍCULOS', 14, yPosition);
      yPosition += 10;

      // ✅ ELIMINAR COLUMNA "INGRESOS" - Solo 5 columnas ahora
      const rankingTableData = rankingData.slice(0, 10).map((vehiculo, index) => [
        `#${index + 1}`,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.patente,
        vehiculo.cantidad_alquileres
        // ❌ Se eliminó: `$${(vehiculo.ingresos_generados || 0).toLocaleString('es-AR')}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Pos.', 'Modelo', 'Marca', 'Patente', 'Alquileres']], // Solo 5 headers
        body: rankingTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [39, 174, 96] },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // 4. ALQUILERES POR PERÍODO
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text(`4. ALQUILERES POR ${periodo.toUpperCase()}`, 14, yPosition);
      yPosition += 10;

      const periodoTableData = periodoData.map(periodo => [
        periodo.periodo,
        periodo.total_alquileres,
        `$${(periodo.ingresos_totales || 0).toLocaleString('es-AR')}`,
        `${(periodo.duracion_promedio || 0).toFixed(1)} días`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Período', 'Total Alq.', 'Ingresos', 'Duración Prom.']],
        body: periodoTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [142, 68, 173] },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // 5. FACTURACIÓN MENSUAL
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('5. FACTURACIÓN MENSUAL', 14, yPosition);
      yPosition += 10;

      const facturacionTableData = facturacionData.map(item => [
        item.periodo,
        `$${(item.total_facturado || 0).toLocaleString('es-AR')}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Mes', 'Facturación']],
        body: facturacionTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [230, 126, 34] },
        margin: { left: 14, right: 14 }
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Página ${i} de ${pageCount} - Sistema de Alquiler de Vehículos`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Guardar PDF
      doc.save(`reporte-alquileres-${dateRange.start}-a-${dateRange.end}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generando PDF completo:', error);
      throw error;
    }
  },

  // Generar PDF individual para cada tipo de reporte
  generateIndividualPDF: async (type, data, dateRange, periodo = 'mensual') => {
    try {
      const doc = new jsPDF();
      
      // ✅ AGREGAR LOGO Y FECHA EN EL HEADER
      await addHeaderToPDF(doc, dateRange);
      
      doc.setFont('helvetica');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      
      const titles = {
        clientes: 'DETALLE DE ALQUILERES POR CLIENTE',
        ranking: 'RANKING DE VEHÍCULOS MÁS ALQUILADOS',
        periodo: `ALQUILERES POR ${periodo.toUpperCase()}`,
        facturacion: 'FACTURACIÓN MENSUAL'
      };
      
      // Título centrado (ajustado por el header)
      doc.text(titles[type], 105, 40, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, 105, 47, { align: 'center' });
      
      let yPosition = 55;

      // CASO ESPECIAL: RANKING - Agregar gráfico de torta
      if (type === 'ranking' && data && data.length > 0) {
        try {
          const chartURL = chartService.generatePieChartURL(
            data, 
            `TOP 8 vehículos más alquilados en el periodo`
          );
          
          if (chartURL) {
            const chartImage = await chartService.loadImageAsBase64(chartURL);
            if (chartImage) {
              doc.addImage(chartImage, 'PNG', 30, yPosition, 150, 90);
              yPosition += 100;
            }
          }
        } catch (chartError) {
          console.warn('No se pudo cargar el gráfico de torta:', chartError);
          // Continuar sin el gráfico
        }
      }

      // CASO ESPECIAL: FACTURACIÓN - Agregar gráfico de barras
      if (type === 'facturacion' && data && data.length > 0) {
        try {
          const chartURL = chartService.generateBarChartURL(
            data,
            `Facturación Mensual (${dateRange.start} a ${dateRange.end})`
          );
          
          if (chartURL) {
            const chartImage = await chartService.loadImageAsBase64(chartURL);
            if (chartImage) {
              doc.addImage(chartImage, 'PNG', 10, yPosition, 190, 90);
              yPosition += 100;
            }
          }
        } catch (chartError) {
          console.warn('No se pudo cargar el gráfico de barras:', chartError);
          // Continuar sin el gráfico
        }
      }

      let tableData = [];
      let headers = [];
      
      switch (type) {
        case 'clientes':
          headers = ['Cliente', 'DNI', 'Fecha Inicio', 'Fecha Fin', 'Días', 'Marca', 'Modelo', 'Patente', 'Total Alquiler'];
          
          // Reestructurar los datos para mostrar subfilas
          const clientesConSubfilas = [];
          
          (data || []).forEach(cliente => {
            // Verificar si el cliente tiene alquileres
            const alquileres = cliente.alquileres || [];
            const totalAlquileres = alquileres.length;
            
            if (totalAlquileres === 0) {
              // Si no tiene alquileres, mostrar solo la fila del cliente
              clientesConSubfilas.push([
                cliente.cliente || 'N/A',
                cliente.nro_documento || 'N/A',
                'Sin alquileres',
                '', '', '', '', '',
                '$0'
              ]);
            } else {
              // Fila principal del cliente (primera fila) - AHORA CON TOTAL INDIVIDUAL
              const primerAlquiler = alquileres[0];
              const diasPrimerAlquiler = pdfService._calcularDiasEnteros(primerAlquiler.fecha_inicio, primerAlquiler.fecha_fin);
              const totalPrimerAlquiler = diasPrimerAlquiler * (primerAlquiler.precio_flota || 0);
              
              clientesConSubfilas.push([
                { content: cliente.cliente || 'N/A', rowSpan: totalAlquileres },
                { content: cliente.nro_documento || 'N/A', rowSpan: totalAlquileres },
                primerAlquiler.fecha_inicio ? pdfService._formatearFecha(primerAlquiler.fecha_inicio) : 'N/A',
                primerAlquiler.fecha_fin ? pdfService._formatearFecha(primerAlquiler.fecha_fin) : 'N/A',
                diasPrimerAlquiler,
                primerAlquiler.marca || 'N/A',
                primerAlquiler.modelo || 'N/A',
                primerAlquiler.patente || 'N/A',
                `$${totalPrimerAlquiler.toLocaleString('es-AR')}`
              ]);
              
              // Subfilas para los alquileres restantes - AHORA CON TOTALES INDIVIDUALES
              for (let i = 1; i < totalAlquileres; i++) {
                const alquiler = alquileres[i];
                const diasAlquiler = pdfService._calcularDiasEnteros(alquiler.fecha_inicio, alquiler.fecha_fin);
                const totalAlquilerIndividual = diasAlquiler * (alquiler.precio_flota || 0);
                
                clientesConSubfilas.push([
                  alquiler.fecha_inicio ? pdfService._formatearFecha(alquiler.fecha_inicio) : 'N/A',
                  alquiler.fecha_fin ? pdfService._formatearFecha(alquiler.fecha_fin) : 'N/A',
                  diasAlquiler,
                  alquiler.marca || 'N/A',
                  alquiler.modelo || 'N/A',
                  alquiler.patente || 'N/A',
                  `$${totalAlquilerIndividual.toLocaleString('es-AR')}`
                ]);
              }
            }
          });

          tableData = clientesConSubfilas;
          break;
          
        case 'ranking':
          headers = ['Pos.', 'Modelo', 'Marca', 'Patente', 'Alquileres'];
          tableData = (data || []).map((vehiculo, index) => [
            `#${index + 1}`,
            vehiculo.modelo || 'N/A',
            vehiculo.marca || 'N/A',
            vehiculo.patente || 'N/A',
            vehiculo.cantidad_alquileres || 0
          ]);
          break;
          
        case 'periodo':
          headers = ['Período', 'Total Alq.', 'Ingresos', 'Duración Prom.'];
          tableData = (data || []).map(periodo => [
            periodo.periodo || 'N/A',
            periodo.total_alquileres || 0,
            `$${((periodo.ingresos_totales || 0)).toLocaleString('es-AR')}`,
            `${((periodo.duracion_promedio || 0)).toFixed(1)} días`
          ]);
          break;
          
        case 'facturacion':
          headers = ['Mes', 'Facturación'];
          tableData = (data || []).map(item => [
            item.periodo || 'N/A',
            `$${((item.total_facturado || 0)).toLocaleString('es-AR')}`
          ]);
          break;
      }
      
      // Solo agregar tabla si hay datos
      if (tableData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [headers],
          body: tableData,
          styles: { fontSize: 8 },
          headStyles: { 
            fillColor: type === 'ranking' ? [39, 174, 96] : [41, 128, 185] 
          },
          margin: { left: 14, right: 14 }
        });
      } else {
        doc.text('No hay datos disponibles', 105, yPosition + 10, { align: 'center' });
      }
      
      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Página ${i} de ${pageCount} - Sistema de Alquiler de Vehículos`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`reporte-${type}-${dateRange.start}-a-${dateRange.end}.pdf`);
      
    } catch (error) {
      console.error('Error generando PDF individual:', error);
      throw error;
    }
  },

  // FUNCIONES AUXILIARES - DENTRO DEL OBJETO pdfService
  _calcularDiasEnteros(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return 0;
    
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      // Resetear horas a mediodía para evitar problemas con horarios
      inicio.setHours(12, 0, 0, 0);
      fin.setHours(12, 0, 0, 0);
      
      const diferencia = fin.getTime() - inicio.getTime();
      const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
      
      // Asegurar mínimo 1 día
      return Math.max(1, dias);
    } catch (error) {
      console.error('Error calculando días:', error);
      return 0;
    }
  },

  _formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'N/A';
    }
  }
};

