export default function Toast({ mensaje, tipo = "success" }) {
  return (
    <div className={`toast toast-${tipo}`}>
      <span>{mensaje}</span>
    </div>
  );
}