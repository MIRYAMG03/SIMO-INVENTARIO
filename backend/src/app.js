const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const equiposRoutes = require('./routes/equiposRoutes');
const catalogosRoutes = require('./routes/catalogosRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const inventarioSucursalRoutes = require('./routes/inventarioSucursalRoutes');
const historialRoutes = require('./routes/historialRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const comisionesRoutes = require('./routes/comisionesRoutes');
const transferenciasRoutes = require('./routes/transferenciasRoutes');
const regresosRoutes = require('./routes/regresosRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');
const graficasRoutes = require('./routes/graficasRoutes');
const authRoutes = require('./routes/authRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

app.use('/equipos', equiposRoutes);
app.use('/catalogos', catalogosRoutes);
app.use('/movimientos', movimientosRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/inventario', inventarioSucursalRoutes);
app.use('/historial', historialRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/ventas', ventasRoutes);
app.use('/comisiones', comisionesRoutes);
app.use('/transferencias', transferenciasRoutes);
app.use('/regresos', regresosRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/graficas', graficasRoutes);
app.use('/auth', authRoutes);
app.use('/reportes', reportesRoutes);

app.get('/', (req, res) => {
    res.send('API Inventario funcionando');
});

const PORT = 3001;

// 404 de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// Errores generales
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    error: "Error interno del servidor"
  });
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});