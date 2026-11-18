/**
 * El secret del JWT se lee SIEMPRE de la variable de entorno JWT_SECRET.
 * Si falta (o es demasiado corto) la aplicación no arranca, en lugar de usar un valor por defecto.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'Falta JWT_SECRET (mínimo 32 caracteres) en las variables de entorno.',
    );
  }
  return secret;
}
