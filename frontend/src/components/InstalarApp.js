import { useEffect, useState } from "react";

let deferredPrompt = null;

export default function InstalarApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      deferredPrompt = event;
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setVisible(false);
      deferredPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const instalar = async () => {
    if (!deferredPrompt) return;

    const result = await deferredPrompt.prompt();
    console.log("Resultado instalación:", result?.outcome);

    deferredPrompt = null;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-text">
        <strong>Instala SIMO</strong>
        <span>Acceso rápido desde escritorio o celular</span>
      </div>

      <div className="install-banner-actions">
        <button className="button-primary" onClick={instalar}>
          Instalar
        </button>
        <button className="install-close-btn" onClick={() => setVisible(false)}>
          Ahora no
        </button>
      </div>
    </div>
  );
}