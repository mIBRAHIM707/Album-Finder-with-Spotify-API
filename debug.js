    // Simple debug script to help identify GitHub Pages issues
(function() {
  // Log environment information
  console.log('Page URL:', window.location.href);
  console.log('Base path:', document.querySelector('base')?.getAttribute('href') || 'No base tag found');
  
  // Check if environment variables are available
  console.log('Environment variables available:', 
    typeof import.meta !== 'undefined' && 
    typeof import.meta.env !== 'undefined' && 
    typeof import.meta.env.VITE_CLIENT_ID !== 'undefined');
  
  // Check for common errors
  window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.message, event.filename, event.lineno);
  });

  // Add a visible indicator if the app fails to load
  setTimeout(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && !rootElement.hasChildNodes()) {
      const debugElement = document.createElement('div');
      debugElement.style.position = 'fixed';
      debugElement.style.top = '50%';
      debugElement.style.left = '50%';
      debugElement.style.transform = 'translate(-50%, -50%)';
      debugElement.style.backgroundColor = 'rgba(0,0,0,0.8)';
      debugElement.style.color = 'white';
      debugElement.style.padding = '20px';
      debugElement.style.borderRadius = '5px';
      debugElement.style.maxWidth = '80%';
      debugElement.style.textAlign = 'center';
      debugElement.innerHTML = `
        <h3>App Loading Error</h3>
        <p>Check the browser console for errors</p>
        <p><small>This message appears because React didn't render anything within 5 seconds</small></p>
      `;
      document.body.appendChild(debugElement);
    }
  }, 5000);
})();