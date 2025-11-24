//import { reportService } from './reportService';

// services/pdfService.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      
      // Configuración inicial
      doc.setFont('helvetica');
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      
      // Título principal
      doc.text('REPORTE COMPLETO DE ALQUILERES', 105, 20, { align: 'center' });
      
      // Información del período
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, 105, 30, { align: 'center' });
      doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 105, 35, { align: 'center' });
      
      let yPosition = 45;

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

      // ✅ USAR autoTable como función separada
      autoTable(doc, {
        startY: yPosition,
        head: [['Cliente', 'Documento', 'Total Alq.', 'Ingresos', 'Duración Prom.', 'Último Alq.']],
        body: clientesTableData,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // 3. RANKING DE VEHÍCULOS (Tabla)
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('3. RANKING DE VEHÍCULOS', 14, yPosition);
      yPosition += 10;

      const rankingTableData = rankingData.slice(0, 10).map((vehiculo, index) => [
        `#${index + 1}`,
        vehiculo.modelo,
        vehiculo.marca,
        vehiculo.patente,
        vehiculo.cantidad_alquileres,
        `$${(vehiculo.ingresos_generados || 0).toLocaleString('es-AR')}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Pos.', 'Modelo', 'Marca', 'Patente', 'Alquileres', 'Ingresos']],
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
      console.error('Error generando PDF:', error);
      throw error;
    }
  },

  // Generar PDF individual para cada tipo de reporte
  generateIndividualPDF: async (type, data, dateRange, periodo = 'mensual') => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    
    const titles = {
      clientes: 'DETALLE DE ALQUILERES POR CLIENTE',
      ranking: 'RANKING DE VEHÍCULOS MÁS ALQUILADOS',
      periodo: `ALQUILERES POR ${periodo.toUpperCase()}`,
      facturacion: 'FACTURACIÓN MENSUAL'
    };
    
    doc.text(titles[type], 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Período: ${dateRange.start} a ${dateRange.end}`, 105, 30, { align: 'center' });
    
    let tableData = [];
    let headers = [];
    
    switch (type) {
      case 'clientes':
        headers = ['Cliente', 'Documento', 'Total Alq.', 'Ingresos', 'Duración Prom.', 'Último Alq.'];
        tableData = data.map(cliente => [
          cliente.cliente,
          cliente.nro_documento || 'N/A',
          cliente.total_alquileres,
          `$${(cliente.total_facturado || 0).toLocaleString('es-AR')}`,
          `${(cliente.duracion_promedio || 0).toFixed(1)} días`,
          cliente.ultimo_alquiler ? new Date(cliente.ultimo_alquiler).toLocaleDateString('es-AR') : 'N/A'
        ]);
        break;
        
      case 'ranking':
        headers = ['Pos.', 'Modelo', 'Marca', 'Patente', 'Alquileres', 'Ingresos'];
        tableData = data.map((vehiculo, index) => [
          `#${index + 1}`,
          vehiculo.modelo,
          vehiculo.marca,
          vehiculo.patente,
          vehiculo.cantidad_alquileres,
          `$${(vehiculo.ingresos_generados || 0).toLocaleString('es-AR')}`
        ]);
        break;
        
      case 'periodo':
        headers = ['Período', 'Total Alq.', 'Ingresos', 'Duración Prom.'];
        tableData = data.map(periodo => [
          periodo.periodo,
          periodo.total_alquileres,
          `$${(periodo.ingresos_totales || 0).toLocaleString('es-AR')}`,
          `${(periodo.duracion_promedio || 0).toFixed(1)} días`
        ]);
        break;
        
      case 'facturacion':
        headers = ['Mes', 'Facturación'];
        tableData = data.map(item => [
          item.periodo,
          `$${(item.total_facturado || 0).toLocaleString('es-AR')}`
        ]);
        break;
    }
    
    // ✅ USAR autoTable como función separada
    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 }
    });
    
    doc.save(`reporte-${type}-${dateRange.start}-a-${dateRange.end}.pdf`);
  }
};