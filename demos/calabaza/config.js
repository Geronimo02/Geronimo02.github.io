/*
 * Datos operativos de Calabaza en Tandil.
 * Los productos y precios siguen siendo de muestra. El enlace de WhatsApp
 * prepara una consulta, que la persona revisa y envía desde su aplicación.
 * Al recibir la carta aprobada, reemplazar las filas de products, confirmar las
 * carta real de cada local, zonas y tarifas de entrega antes de publicar.
 */
window.CALABAZA_DATA = Object.freeze({
  branches: [
    { id: "belgrano", name: "Calabaza Belgrano", address: "Belgrano 1301, Tandil", whatsappDisplay: "2494 250786", whatsappNumber: "5492494250786", hours: "Lun a sáb · 10:00 a 00:00" },
    { id: "centro", name: "Calabaza Centro", address: "Mitre 587, Tandil", whatsappDisplay: "2494 515627", whatsappNumber: "5492494515627", hours: "Lun a sáb · 10:00 a 16:00 y 19:00 a 00:00" }
  ],
  order: {
    demoOnly: true,
    enabledModes: ["retiro", "envio"], // Ambos servicios figuran en los datos facilitados para las dos sucursales.
    deliveryFee: null
  },
  categories: [
    { id: "para-empezar", label: "Para empezar" },
    { id: "platos", label: "Platos" },
    { id: "algo-dulce", label: "Algo dulce" }
  ],
  products: [
    { id: "muestra-entrada", category: "para-empezar", name: "Tarta de verduras", wheelLabel: "Tarta", roulette: true, description: "Producto ilustrativo para probar la selección. No integra la carta confirmada.", image: "img/optimized/tarta-espinaca.jpg", imageAlt: "Pequeñas tartas saladas sobre un plato", price: 4500, available: true },
    { id: "muestra-entrada-2", category: "para-empezar", name: "Porción de tarta", wheelLabel: "Porción", roulette: true, description: "Ejemplo visual; ingredientes, presentación y disponibilidad por confirmar.", image: "img/optimized/tarta-porción.jpg", imageAlt: "Porción de tarta salada acompañada con hojas verdes", price: 5200, available: true },
    { id: "muestra-plato", category: "platos", name: "Pasta con vegetales", wheelLabel: "Pasta", roulette: true, description: "Plato de muestra para revisar cantidades y subtotal del pedido.", image: "img/optimized/pasta-verde.jpg", imageAlt: "Pasta con hongos y hojas verdes en un plato blanco", price: 9800, available: true },
    { id: "muestra-plato-agotado", category: "platos", name: "Ravioles", description: "Ejemplo del estado sin disponibilidad; producto no confirmado.", image: "img/optimized/ravioles.jpg", imageAlt: "Ravioles servidos en un plato sobre una mesa de mármol", price: 10500, available: false },
    { id: "muestra-postre", category: "algo-dulce", name: "Brownie", wheelLabel: "Brownie", roulette: true, description: "Postre ilustrativo para probar una categoría adicional.", image: "img/optimized/brownies.jpg", imageAlt: "Porciones de brownie de chocolate en una fuente pequeña", price: 3900, available: true },
    { id: "muestra-postre-2", category: "algo-dulce", name: "Flan", wheelLabel: "Flan", roulette: true, description: "Ejemplo visual; se reemplazará con el producto aprobado por Calabaza.", image: "img/optimized/flan.jpg", imageAlt: "Flan con caramelo servido en un cuenco blanco", price: 4300, available: true }
  ],
  viandas: {
    enabled: false,
    demoPreview: true,
    weekStart: null, // Fecha ISO del lunes cuando exista un menú real aprobado.
    weekMenu: [
      { day: "Lunes", dish: "Tarta de verduras", detail: "Opción ilustrativa", price: 8200 },
      { day: "Martes", dish: "Pasta con vegetales", detail: "Opción ilustrativa", price: 9200 },
      { day: "Miércoles", dish: "Porción de tarta", detail: "Opción ilustrativa", price: 8700 },
      { day: "Jueves", dish: "Pasta con vegetales", detail: "Opción ilustrativa", price: 9200 },
      { day: "Viernes", dish: "Tarta de verduras", detail: "Opción ilustrativa", price: 8200 }
    ],
    packEnabled: false // Confirmar si realmente existe un pack antes de habilitar compra.
  }
});
