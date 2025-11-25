// services/logoService.js
export const logoService = {
  /**
   * Carga el logo como base64 para usar en PDF
   */
  loadLogoAsBase64: async () => {
    try {
      // Ruta relativa desde el directorio public
      const response = await fetch('../../src/assets/logo-sin-fondo.png');
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
      console.error('Error cargando logo:', error);
      return null;
    }
  },

  /**
   * Obtiene la fecha actual formateada
   */
  getCurrentDateFormatted: () => {
    const now = new Date();
    return now.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};