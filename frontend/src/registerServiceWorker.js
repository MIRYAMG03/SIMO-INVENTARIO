export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registrado:", registration.scope);
      } catch (error) {
        console.error("Error registrando Service Worker:", error);
      }
    });
  }
}