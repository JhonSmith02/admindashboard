import React, { useEffect } from 'react'

// Fondo animado - componente separado que no afecta al dashboard
const BackgroundAnimado = () => {
  useEffect(() => {
    // Aplicar estilos al body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradient 15s ease infinite';
    document.body.style.minHeight = '100vh';
    
    // Crear la animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Limpiar al desmontar
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.animation = '';
      document.head.removeChild(style);
    };
  }, []);

  return null; // Este componente no renderiza nada visible
};

export default BackgroundAnimado;