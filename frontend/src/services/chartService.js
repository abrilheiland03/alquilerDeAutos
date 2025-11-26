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
  },

  /**
   * Genera URL de gráfico lineal para evolución de alquileres por período
   */
  generateLineChartURL: (periodoData, title, tipoPeriodo = 'mensual') => {
    if (!periodoData || periodoData.length === 0) {
      console.warn('No hay datos para generar el gráfico lineal');
      return null;
    }

    // Ordenar los datos por período
    const sortedData = [...periodoData].sort((a, b) => a.periodo.localeCompare(b.periodo));
    
    // Formatear labels según el tipo de período
    const labels = sortedData.map(item => {
      // Función auxiliar para formatear el período
      const formatPeriodo = (periodoString, tipo) => {
        switch (tipo.toLowerCase()) {
          case 'mensual':
            const [year, month] = periodoString.split('-');
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return `${monthNames[parseInt(month) - 1]}`;
          case 'trimestral':
            const [yearQ, quarter] = periodoString.split('-');
            return `T${quarter}`;
          case 'anual':
            return periodoString.substring(2); // "2025" -> "25"
          default:
            return periodoString;
        }
      };
      
      return formatPeriodo(item.periodo, tipoPeriodo);
    });

    const alquileresData = sortedData.map(item => item.total_alquileres || 0);
    const ingresosData = sortedData.map(item => Math.round((item.ingresos_totales || 0) / 1000)); // En miles, números enteros

    // Configuración CORREGIDA para QuickChart
    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Alquileres',
            data: alquileresData,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Ingresos (miles $)',
            data: ingresosData,
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title,
          fontSize: 16
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: `Período (${tipoPeriodo})`
            }
          }],
          yAxes: [
            {
              id: 'y',
              type: 'linear',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Cantidad de Alquileres'
              },
              ticks: {
                beginAtZero: true
              }
            },
            {
              id: 'y1',
              type: 'linear',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: 'Ingresos (miles $)'
              },
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                drawOnChartArea: false
              }
            }
          ]
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    };
    
    // URL más corta y compatible
    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&width=600&height=300`;
  },
};