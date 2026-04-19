import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((mensaje, tipo = "success") => {
    setToast({ mensaje, tipo });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}