import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Crea (o promueve) un usuario administrador.
//   ADMIN_EMAIL=admin@ejemplo.com ADMIN_PASSWORD="una-clave-larga" npm run create-admin
// Opcionales: ADMIN_NOMBRE, ADMIN_APELLIDO. Si el email ya existe, pasa a ADMIN, queda verificado
// y se le cambia la contraseña por la indicada.
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Definí ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres).');
  }

  const hashed = await bcrypt.hash(password, 10);
  const nombre = process.env.ADMIN_NOMBRE ?? 'Admin';
  const apellido = process.env.ADMIN_APELLIDO ?? 'Tienda';

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: { rol: 'ADMIN', isVerified: true, password: hashed },
    create: { email, password: hashed, nombre, apellido, rol: 'ADMIN', isVerified: true },
  });

  console.log(`Administrador listo: ${usuario.email} (id ${usuario.id}).`);
}

main()
  .catch((error) => {
    console.error('Error creando el administrador:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
