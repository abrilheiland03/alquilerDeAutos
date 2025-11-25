// services/chartService.js
export const chartService = {
  /**
   * Genera URL de gráfico de torta para ranking de vehículos
   */
  generatePieChartURL: (rankingData, title) => {
    if (!rankingData || rankingData.length === 0) {
      console.warn('No hay datos para generar el gráfico de torta');
      return null;
    }

    // Tomar los top 8 vehículos
    const topVehicles = rankingData.slice(0, 8);
    
    const labels = topVehicles.map(vehicle => 
      `${vehicle.modelo} - (${vehicle.patente})`
    );
    const values = topVehicles.map(vehicle => vehicle.cantidad_alquileres || 0);
    
    const chartConfig = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ]
        }]
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 12
        },
        legend: {
          position: 'right'
        }
      }
    };
    
    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=500&height=300`;
  },

  /**
   * Genera URL de gráfico de barras para facturación
   */
  generateBarChartURL: (facturacionData, title = "Facturación Mensual") => {
    if (!facturacionData || facturacionData.length === 0) {
      console.warn('No hay datos para generar el gráfico de barras');
      return null;
    }

    const labels = facturacionData.map(item => item.periodo);
    const values = facturacionData.map(item => parseFloat(item.total_facturado) || 0);
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Facturación ($)',
          data: values,
          backgroundColor: '#36A2EB',
          borderColor: '#1E78C7',
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };
    
    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=600&height=300`;
  },

  /**
   * Carga una imagen desde URL y la convierte en base64 para jsPDF
   */
  loadImageAsBase64: async (url) => {
    if (!url) {
      console.warn('URL del gráfico no proporcionada');
      return null;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error cargando imagen del gráfico:', error);
      return null;
    }
  }
};