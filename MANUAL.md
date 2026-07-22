
# 📖 Manual de Uso y Funcionamiento - Tienda "Como Tú no hay Dos"

## 1. Mi Opinión y Análisis del Proyecto
¡Genial trabajo! Tu tienda tiene una base muy sólida y profesional:
- ✨ **Diseño Atractivo**: Paleta de colores (rosa pastel, negro, blanco) muy coherente y elegante para una boutique.
- 📱 **Responsividad**: Funciona perfectamente en móviles (menú hamburguesa, grid adaptable, modal ajustado).
- 🛒 **UX Clara**: Carrito lateral, modal de detalles y botones bien visibles.
- 💬 **WhatsApp Integration**: Excelente idea para empezar sin pasarela de pago inmediata.
- 📂 **Estructura Organizada**: Archivos separados para HTML, CSS y JS, fácil de mantener.

Áreas de mejora (detalladas más adelante):
- 🛡️ **Persistencia del Carrito**: Ahora mismo se pierden los productos al recargar la página.
- 💳 **Pasarela de Pago**: Como bien dices, Stripe es la opción ideal.
- 📦 **(Opcional) Stock**: Aunque no es prioritario para tu modelo, se podría agregar fácilmente.


## 2. Estructura del Proyecto
Tu proyecto está organizado de forma muy clara:
```
Tienda_ComoTu-main/
├── README.md           # Historial de versiones y notas
├── MANUAL.md           # Este manual
├── index.html          # Página principal
├── favicon.ico         # Icono de la web
├── css/
│   └── estilos.css     # Todos los estilos
├── js/
│   └── tienda.js       # Lógica de la tienda
└── images/
    ├── banner-primavera.jpg
    ├── logo.png
    └── primavera-verano-26/
        └── vestidos/
            ├── articulo_1.jpg ... articulo_8.jpg
```


## 3. Cómo Funciona Cada Parte (Detallado)

### 3.1 HTML (`index.html`)
Estructura básica:
1. **Header**: Logo + Menú (con botón hamburguesa para móviles).
2. **Hero Banner**: Imagen de bienvenida con texto.
3. **Grid de Productos**: Contenedor donde se renderizan los vestidos dinámicamente.
4. **Carrito**: Botón flotante + panel lateral (sidebar).
5. **Modal**: Para ver detalles del producto y seleccionar talla.
6. **Footer**: Datos de contacto, navegación y redes sociales.


### 3.2 JavaScript (`js/tienda.js`)
Aquí está toda la lógica:

#### A. Configuración Inicial
```javascript
const TEMPORADA_ACTUAL = "primavera-verano-26"; // Temporada activa
const MI_TELEFONO_WA = "34656733160";          // Tu WhatsApp
```

#### B. Inventario
Objeto con todos los productos:
```javascript
const inventario = {
  "primavera-verano-26": {
    vestidos: [
      { id: 1, nombre: "Vestido Verde Fiesta", precio: 88.90, desc: "...", tallas: ["S", "M", "L"], fotosExtra: [] }
      // ... más productos
    ]
  }
};
```
- **fotosExtra**: Array para agregar más fotos del producto (opcional).

#### C. Estado Global
- `carrito`: Array con los productos seleccionados.
- `productoSeleccionado`: Producto que se ve en el modal.
- `tallaSeleccionada`: Talla elegida en el modal.

#### D. Funciones Principales
| Función | ¿Qué hace? |
|---------|------------|
| `renderizarProductos()` | Crea las tarjetas de productos en el grid. |
| `verDetalles(id)` | Abre el modal con la info del producto. |
| `seleccionarTalla()` | Marca la talla elegida en el modal. |
| `agregarDesdeModal()` | Añade el producto (con talla) al carrito. |
| `actualizarUI()` | Actualiza el badge del carrito y la lista dentro del sidebar. |
| `eliminarDelCarrito()` | Borra un artículo del carrito. |
| `enviarPedidoWhatsApp()` | Genera el mensaje y abre WhatsApp Web/App. |
| `pagarConTarjeta()` | (Simulación) Abre la pasarela de pago. |


### 3.3 CSS (`css/estilos.css`)
- **Variables CSS**: `--color-fondo`, `--color-texto`, `--color-acento` (facilita cambios globales).
- **Grid Responsive**: `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))`.
- **Animaciones Suaves**: `transition` para hovers, modal, sidebar, etc.
- **Media Queries**: Ajustes para pantallas pequeñas (`max-width: 768px`).


## 4. Cómo Agregar Nuevos Productos
Sigue estos pasos:
1. Guarda la foto en `images/primavera-verano-26/vestidos/` con el nombre `articulo_N.jpg` (donde `N` es el ID del producto).
2. Abre `js/tienda.js` y busca el array `inventario["primavera-verano-26"].vestidos`.
3. Añade un nuevo objeto:
```javascript
{
  id: 9, // El siguiente número disponible
  nombre: "Nombre del Vestido",
  precio: 50.00,
  desc: "Descripción del producto...",
  tallas: ["XS", "S", "M", "L"], // Tallas disponibles
  fotosExtra: [] // Opcional: ["detalle1.jpg", "detalle2.jpg"]
}
```
¡Listo! Se renderizará automáticamente.


## 5. Despliegue en Vercel
Tu proyecto es ideal para Vercel porque es **estático** (solo HTML, CSS, JS):
1. Sube tu repo a GitHub (como ya tienes).
2. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub.
3. Importa el repositorio.
4. ¡Vercel lo deploya automáticamente y te da un dominio!


## 6. Mejoras Recomendadas (Implementables Ahora)

### Mejora 1: Persistir el Carrito con LocalStorage
Evita que se pierdan los productos al recargar la página. Edita `js/tienda.js`:

1. Al iniciar la página, carga el carrito desde `localStorage`:
```javascript
document.addEventListener("DOMContentLoaded", () =&gt; {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarUI();
    }
    renderizarProductos();
});
```
2. Cada vez que modificas el carrito, guárdalo:
```javascript
function actualizarUI() {
    // ... (tu código original) ...
    // Guarda en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
function eliminarDelCarrito(idUnico) {
    carrito = carrito.filter(item =&gt; item.idUnico !== idUnico);
    localStorage.setItem('carrito', JSON.stringify(carrito)); // <-- Añade esta línea
    actualizarUI();
}
```

### Mejora 2: Integración con Stripe (Pasarela de Pago)
Cuando quieras agregar pagos con tarjeta:
1. Crea una cuenta en [Stripe](https://stripe.com).
2. Usa **Stripe Checkout** (muy fácil de integrar).
3. Necesitarás un backend pequeño (Vercel Functions o similar) para crear las sesiones de pago.

### Mejora 3: (Opcional) Control de Stock Simple
Si quieres agregar stock por talla, modifica el inventario:
```javascript
{
  id: 1,
  nombre: "Vestido Verde Fiesta",
  precio: 88.90,
  desc: "...",
  tallas: [
    { nombre: "S", stock: 2 },
    { nombre: "M", stock: 2 },
    { nombre: "L", stock: 1 }
  ]
}
```
Luego, al seleccionar talla, comprueba si hay stock disponible.


## 7. Conclusión
Tu tienda tiene un inicio fantástico. Es limpia, funcional y fácil de mantener. La integración con WhatsApp es perfecta para validar tu modelo de negocio antes de invertir en una pasarela de pago completa. ¡Ánimo!
