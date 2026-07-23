// ==========================================
// CONFIGURACIÓN DE LA TIENDA
// ==========================================
const TEMPORADA_ACTUAL = "primavera-verano-26";
const MI_TELEFONO_WA = "34656733160"; // Cambia por tu número real para pruebas

// ==========================================
// NUESTRO INVENTARIO CON TALLAS Y FOTOS EXTRA
// ==========================================
const inventario = {
    "primavera-verano-26": {
        vestidos: [
            { 
                id: 1, 
                nombre: "Vestido Verde Fiesta", 
                precio: 48.90, 
                desc: "Elegante vestido de fiesta con una caída espectacular y espalda abierta. Ideal para eventos de noche en verano.",
                tallas: ["S", "M", "L"],
                // Opcional: más fotos. Si no las pones, usará solo la principal
                fotosExtra: [] 
            },
            { 
                id: 2, 
                nombre: "Vestido Marino Casual", 
                precio: 48.90, 
                desc: "Tejido fresco de lino, ideal para el día a día. Cómodo, ligero y con bolsillos laterales.",
                tallas: ["S", "M", "L", "XL"],
                fotosExtra: []
            },
            { 
                id: 3, 
                nombre: "Vestido Ibiza Blanco", 
                precio: 48.90, 
                desc: "Clásico estilo ibicenco 100% algodón con detalles bordados en el pecho y bajo asimétrico.",
                tallas: ["S", "M", "L"],
                fotosExtra: []
            },
            { 
                id: 4, 
                nombre: "Vestido Lino Arena", 
                precio: 48.90, 
                desc: "Corte recto, cuello camisero y tacto ultra suave. Perfecto para un look sofisticado de tarde.",
                tallas: ["S", "M", "L"],
                fotosExtra: []
            },
            { 
                id: 5, 
                nombre: "Vestido Floral Midi", 
                precio: 42.50, 
                desc: "Estampado alegre de flores silvestres. Cintura elástica adaptable y falda con volantes.",
                tallas: ["S", "M", "L", "XL"],
                fotosExtra: []
            },
            { 
                id: 6, 
                nombre: "Vestido Rojo Coral", 
                precio: 38.90, 
                desc: "Escote halter y espalda cruzada muy favorecedora. Un color vibrante para tus noches de verano.",
                tallas: ["S", "M"],
                fotosExtra: []
            },
            { 
                id: 7, 
                nombre: "Vestido Camisero Rayas", 
                precio: 38.90, 
                desc: "Comodidad con un toque chic marinero. Incluye cinturón del mismo tejido.",
                tallas: ["S", "M", "L", "XL"],
                fotosExtra: []
            },
            { 
                id: 8, 
                nombre: "Vestido Boho Largo", 
                precio: 48.90, 
                desc: "Estilo bohemio con manga tres cuartos, escote en pico y detalles de encaje.",
                tallas: ["S", "M", "L"],
                fotosExtra: []
            }
        ]
    }
};

// ==========================================
// ESTADO DE LA TIENDA
// ==========================================
let carrito = [];
let productoSeleccionado = null; // Para controlar qué se ve en el modal
let tallaSeleccionada = "";

// Cargar productos dinámicamente en la web al iniciar
document.addEventListener("DOMContentLoaded", () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarUI();
    }
    renderizarProductos();
});

// Renderizar la cuadrícula de vestidos
function renderizarProductos() {
    const contenedor = document.getElementById("grid-productos");
    if (!contenedor) return;

    const vestidos = inventario[TEMPORADA_ACTUAL].vestidos;
    contenedor.innerHTML = ""; 

    vestidos.forEach(producto => {
        const rutaImagen = `images/${TEMPORADA_ACTUAL}/vestidos/articulo_${producto.id}.jpg`;

        const tarjetaHTML = `
            <div class="producto-tarjeta">
                <div class="producto-img-container" onclick="verDetalles(${producto.id})">
                    <img src="${rutaImagen}" alt="${producto.nombre}" class="producto-img">
                    <div class="overlay-ver"><span>Ver detalles</span></div>
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="desc">${producto.desc.substring(0, 50)}...</p>
                    <p class="precio">${producto.precio.toFixed(2)} €</p>
                    <button class="btn-add" onclick="verDetalles(${producto.id})">
                        Elegir Talla / Comprar
                    </button>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjetaHTML;
    });
}

// ==========================================
// SISTEMA DEL MODAL (DETALLES Y TALLAS)
// ==========================================
function verDetalles(id) {
    const vestidos = inventario[TEMPORADA_ACTUAL].vestidos;
    const producto = vestidos.find(p => p.id === id);
    if (!producto) return;

    productoSeleccionado = producto;
    tallaSeleccionada = ""; // Resetear talla

    const rutaImgPrincipal = `images/${TEMPORADA_ACTUAL}/vestidos/articulo_${producto.id}.jpg`;

    // Rellenar datos en el modal
    document.getElementById("modal-main-img").src = rutaImgPrincipal;
    document.getElementById("modal-main-img").alt = producto.nombre;
    document.getElementById("modal-title").textContent = producto.nombre;
    document.getElementById("modal-price").textContent = `${producto.precio.toFixed(2)} €`;
    document.getElementById("modal-desc").textContent = producto.desc;

    // Ocultar mensaje de error de talla
    document.getElementById("talla-error").style.display = "none";

    // Cargar selector de tallas
    const tallasContainer = document.getElementById("modal-tallas-container");
    tallasContainer.innerHTML = "";
    producto.tallas.forEach(talla => {
        const btn = document.createElement("button");
        btn.className = "talla-btn";
        btn.textContent = talla;
        btn.onclick = () => seleccionarTalla(btn, talla);
        tallasContainer.appendChild(btn);
    });

    // Galería elemental de fotos extra (si las hay)
    const galleryContainer = document.getElementById("modal-thumbnails");
    galleryContainer.innerHTML = "";
    
    // Añadimos siempre la principal como primera miniatura
    const thumbPrincipal = document.createElement("img");
    thumbPrincipal.src = rutaImgPrincipal;
    thumbPrincipal.className = "thumb-img active";
    thumbPrincipal.onclick = () => cambiarImagenPrincipal(thumbPrincipal, rutaImgPrincipal);
    galleryContainer.appendChild(thumbPrincipal);

    // Si hay fotos de detalle extra, las añadimos
    if (producto.fotosExtra && producto.fotosExtra.length > 0) {
        producto.fotosExtra.forEach((foto, index) => {
            const rutaFotoExtra = `images/${TEMPORADA_ACTUAL}/vestidos/${foto}`;
            const thumbExtra = document.createElement("img");
            thumbExtra.src = rutaFotoExtra;
            thumbExtra.className = "thumb-img";
            thumbExtra.onclick = () => cambiarImagenPrincipal(thumbExtra, rutaFotoExtra);
            galleryContainer.appendChild(thumbExtra);
        });
    }

    // Mostrar el modal
    document.getElementById("product-modal").classList.add("open");
}

function cambiarImagenPrincipal(elementoThumb, ruta) {
    document.getElementById("modal-main-img").src = ruta;
    // Quitar "active" de todos y ponérselo al clicado
    document.querySelectorAll(".thumb-img").forEach(img => img.classList.remove("active"));
    elementoThumb.classList.add("active");
}

function seleccionarTalla(boton, talla) {
    tallaSeleccionada = talla;
    // Quitar activo de todos los botones de talla y activar este
    document.querySelectorAll(".talla-btn").forEach(btn => btn.classList.remove("active"));
    boton.classList.add("active");
    // Ocultar error si estaba visible
    document.getElementById("talla-error").style.display = "none";
}

function cerrarModal() {
    document.getElementById("product-modal").classList.remove("open");
}

function cerrarModalExterno(event) {
    if (event.target.id === "product-modal") {
        cerrarModal();
    }
}

// ==========================================
// ACCIONES DEL CARRITO DESDE EL MODAL
// ==========================================
function agregarDesdeModal() {
    if (!productoSeleccionado) return;

    if (!tallaSeleccionada) {
        document.getElementById("talla-error").style.display = "block";
        return;
    }

    const idUnico = `${productoSeleccionado.id}-${tallaSeleccionada}`;
    const rutaImagen = `images/${TEMPORADA_ACTUAL}/vestidos/articulo_${productoSeleccionado.id}.jpg`;

    // Buscar si ya existe el mismo artículo con la MISMA TALLA
    const existe = carrito.find(item => item.idUnico === idUnico);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({
            idUnico: idUnico,
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            talla: tallaSeleccionada,
            precio: productoSeleccionado.precio,
            img: rutaImagen,
            cantidad: 1
        });
    }

    cerrarModal();
    actualizarUI();
    abrirCarritoVisual();
}

function actualizarUI() {
    const badge = document.getElementById("cart-badge");
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "block" : "none";

    const lista = document.getElementById("cart-items");
    lista.innerHTML = "";

    let totalDinero = 0;

    carrito.forEach(item => {
        totalDinero += item.precio * item.cantidad;
        lista.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p class="cart-item-talla">Talla: <strong>${item.talla}</strong></p>
                    <p>${item.cantidad} x ${item.precio.toFixed(2)} €</p>
                </div>
                <button class="btn-remove" onclick="eliminarDelCarrito('${item.idUnico}')">×</button>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent = totalDinero.toFixed(2) + " €";
    
    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(idUnico) {
    carrito = carrito.filter(item => item.idUnico !== idUnico);
    actualizarUI();
}

function abrirCarritoVisual() {
    document.getElementById("cart-sidebar").classList.add("active");
}

function cerrarCarritoVisual() {
    document.getElementById("cart-sidebar").classList.remove("active");
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "¡Hola! He estado viendo vuestra web y quiero confirmar este pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.nombre} - Talla ${item.talla} (x${item.cantidad}) - ${subtotal.toFixed(2)} €\n`;
    });

    mensaje += `\n*Total estimado: ${total.toFixed(2)} €*\n\n¿Me indicáis cómo hacemos el pago y el envío? ¡Gracias!`;

    const mensajeUrl = encodeURIComponent(mensaje);
    const urlWa = `https://web.whatsapp.com/send?phone=${MI_TELEFONO_WA}&text=${mensajeUrl}`;
    
    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const enlaceFinal = esMovil ? `https://wa.me/${MI_TELEFONO_WA}?text=${mensajeUrl}` : urlWa;

    window.open(enlaceFinal, '_blank');
}

function pagarConTarjeta() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    
    // Alerta temporal solicitada para simular la pasarela
    alert("Abriendo pasarela de pago segura... (Simulación)");
}

// Función para abrir/cerrar el menú hamburguesa en móviles
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}
