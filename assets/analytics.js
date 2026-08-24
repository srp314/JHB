// Vercel Web Analytics initialization
// This will be automatically replaced with the proper tracking code when deployed to Vercel
(function() {
  // Initialize Vercel Analytics
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  
  // The actual analytics script will be injected by Vercel when deployed
  // For local development, this is a no-op
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    var script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
  }
})();
