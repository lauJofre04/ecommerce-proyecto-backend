import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedProduct = {
  nombre: string;
  descripcion: string;
  precio: number;
  stockDisponible: number;
  categoria: string;
  imagenUrl: string;
};

const products: SeedProduct[] = [
  {
    nombre: 'iPhone 15 128GB',
    descripcion: 'Smartphone Apple con pantalla Super Retina XDR y camara de 48 MP.',
    precio: 999999,
    stockDisponible: 12,
    categoria: 'Smartphones',
    imagenUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Samsung Galaxy S24',
    descripcion: 'Smartphone premium con pantalla AMOLED de 6.2 pulgadas y 256GB.',
    precio: 849999,
    stockDisponible: 15,
    categoria: 'Smartphones',
    imagenUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Google Pixel 8',
    descripcion: 'Celular Android con fotografia computacional y funciones de inteligencia artificial.',
    precio: 729999,
    stockDisponible: 8,
    categoria: 'Smartphones',
    imagenUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Xiaomi Redmi Note 13 Pro',
    descripcion: 'Pantalla AMOLED de 120Hz, camara de 200 MP y bateria de larga duracion.',
    precio: 399999,
    stockDisponible: 20,
    categoria: 'Smartphones',
    imagenUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Motorola Edge 50 Fusion',
    descripcion: 'Smartphone liviano con pantalla pOLED, 5G y carga rapida.',
    precio: 549999,
    stockDisponible: 10,
    categoria: 'Smartphones',
    imagenUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'MacBook Air M3',
    descripcion: 'Notebook ultradelgada con chip Apple M3, 8GB de RAM y SSD de 256GB.',
    precio: 1899999,
    stockDisponible: 6,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Lenovo IdeaPad Slim 3',
    descripcion: 'Notebook de 15.6 pulgadas con procesador Ryzen 5 y SSD de 512GB.',
    precio: 799999,
    stockDisponible: 11,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'ASUS Vivobook 15',
    descripcion: 'Notebook versatil para estudio y trabajo con pantalla Full HD.',
    precio: 899999,
    stockDisponible: 9,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Monitor LG UltraGear 27',
    descripcion: 'Monitor gamer QHD de 27 pulgadas con tasa de refresco de 144Hz.',
    precio: 649999,
    stockDisponible: 7,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Teclado mecanico Keychron K2',
    descripcion: 'Teclado mecanico compacto 75% con conexion Bluetooth y USB-C.',
    precio: 139999,
    stockDisponible: 18,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Mouse Logitech MX Master 3S',
    descripcion: 'Mouse ergonomico inalambrico de alta precision para productividad.',
    precio: 109999,
    stockDisponible: 25,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Apple Magic Mouse',
    descripcion: 'Mouse inalambrico multitouch con diseño minimalista y bateria recargable.',
    precio: 129999,
    stockDisponible: 13,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Hub USB-C 7 en 1',
    descripcion: 'Adaptador multipuerto con HDMI, USB 3.0, lector SD y carga PD.',
    precio: 49999,
    stockDisponible: 30,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Cargador GaN 65W',
    descripcion: 'Cargador compacto de carga rapida para notebook, tablet y celular.',
    precio: 59999,
    stockDisponible: 22,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Cable USB-C trenzado 2m',
    descripcion: 'Cable reforzado compatible con carga rapida y transferencia de datos.',
    precio: 14999,
    stockDisponible: 45,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1618577608401-189f7d9f3a5b?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Sony WH-1000XM5',
    descripcion: 'Auriculares over-ear con cancelacion activa de ruido y hasta 30 horas de bateria.',
    precio: 499999,
    stockDisponible: 8,
    categoria: 'Audio',
    imagenUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'AirPods Pro 2',
    descripcion: 'Auriculares in-ear con cancelacion activa, audio espacial y estuche MagSafe.',
    precio: 299999,
    stockDisponible: 16,
    categoria: 'Audio',
    imagenUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'JBL Tune 770NC',
    descripcion: 'Auriculares Bluetooth con cancelacion de ruido y sonido JBL Pure Bass.',
    precio: 119999,
    stockDisponible: 19,
    categoria: 'Audio',
    imagenUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Parlante JBL Flip 6',
    descripcion: 'Parlante portatil resistente al agua con 12 horas de reproduccion.',
    precio: 139999,
    stockDisponible: 14,
    categoria: 'Audio',
    imagenUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Barra de sonido Samsung B-Series',
    descripcion: 'Sistema de sonido 2.1 con subwoofer inalambrico para tu TV.',
    precio: 249999,
    stockDisponible: 5,
    categoria: 'Audio',
    imagenUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'PlayStation 5 Slim',
    descripcion: 'Consola de nueva generacion con SSD de 1TB y lector de discos.',
    precio: 1199999,
    stockDisponible: 4,
    categoria: 'Gaming',
    imagenUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Xbox Series X',
    descripcion: 'Consola de alto rendimiento con 1TB de almacenamiento y juegos en 4K.',
    precio: 1099999,
    stockDisponible: 4,
    categoria: 'Gaming',
    imagenUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Nintendo Switch OLED',
    descripcion: 'Consola hibrida con pantalla OLED de 7 pulgadas y 64GB de almacenamiento.',
    precio: 699999,
    stockDisponible: 10,
    categoria: 'Gaming',
    imagenUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Joystick DualSense PS5',
    descripcion: 'Control inalambrico con gatillos adaptativos y respuesta haptica.',
    precio: 139999,
    stockDisponible: 17,
    categoria: 'Gaming',
    imagenUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Logitech G Pro X Superlight 2',
    descripcion: 'Mouse gamer ultraliviano con sensor HERO 2 y tecnologia inalambrica Lightspeed.',
    precio: 179999,
    stockDisponible: 12,
    categoria: 'Gaming',
    imagenUrl: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Webcam Logitech C920',
    descripcion: 'Camara Full HD 1080p con microfonos stereo para videollamadas y streaming.',
    precio: 99999,
    stockDisponible: 21,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Smartwatch Amazfit GTR 4',
    descripcion: 'Reloj inteligente con GPS, monitoreo deportivo y hasta 14 dias de bateria.',
    precio: 199999,
    stockDisponible: 9,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Kindle Paperwhite 16GB',
    descripcion: 'Lector electronico con pantalla de 6.8 pulgadas sin reflejos y luz calida.',
    precio: 189999,
    stockDisponible: 7,
    categoria: 'Accesorios',
    imagenUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Disco SSD externo Samsung T7 1TB',
    descripcion: 'Almacenamiento portatil rapido, compacto y resistente con USB 3.2.',
    precio: 149999,
    stockDisponible: 15,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Router TP-Link WiFi 6',
    descripcion: 'Router de doble banda con cobertura amplia y velocidades de hasta 1.8Gbps.',
    precio: 89999,
    stockDisponible: 18,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=85',
  },
  {
    nombre: 'Impresora multifuncion Epson EcoTank',
    descripcion: 'Impresora WiFi con sistema de tinta continua, scanner y bajo costo por pagina.',
    precio: 329999,
    stockDisponible: 6,
    categoria: 'Computacion',
    imagenUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=85',
  },
];

async function findOrCreateCategory(nombre: string) {
  const existing = await prisma.categoria.findFirst({ where: { nombre } });
  return existing ?? prisma.categoria.create({ data: { nombre } });
}

async function main() {
  const categories = new Map<string, number>();

  for (const product of products) {
    if (!categories.has(product.categoria)) {
      const category = await findOrCreateCategory(product.categoria);
      categories.set(product.categoria, category.id);
    }
  }

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    const existing = await prisma.producto.findFirst({
      where: { nombre: product.nombre },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.producto.create({
      data: {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stockDisponible: product.stockDisponible,
        estado: true,
        imagenUrl: product.imagenUrl,
        categoriaId: categories.get(product.categoria)!,
      },
    });
    created++;
  }

  console.log(`Seed finalizado: ${created} productos creados, ${skipped} ya existentes.`);
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
