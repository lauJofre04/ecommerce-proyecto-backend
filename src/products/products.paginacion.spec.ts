import { ProductsService } from './products.service';

describe('ProductsService.findAll (paginación)', () => {
  const productos = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, nombre: `P${i + 1}` }));
  let prisma: { producto: { count: jest.Mock; findMany: jest.Mock } };
  let service: ProductsService;

  beforeEach(() => {
    prisma = {
      producto: {
        count: jest.fn().mockResolvedValue(productos.length),
        findMany: jest.fn().mockImplementation(({ skip = 0, take }: { skip?: number; take?: number }) =>
          Promise.resolve(productos.slice(skip, take === undefined ? undefined : skip + take)),
        ),
      },
    };
    // Solo se usa prisma.producto; el resto del servicio no interviene
    service = new ProductsService(prisma as never);
  });

  it('sin parámetros devuelve el arreglo completo (compatibilidad)', async () => {
    const res = await service.findAll();
    expect(Array.isArray(res)).toBe(true);
    expect(res).toHaveLength(30);
    expect(prisma.producto.count).not.toHaveBeenCalled();
  });

  it('con page y limit devuelve una página con metadatos', async () => {
    const res = (await service.findAll(2, 10)) as { data: unknown[]; total: number; page: number; limit: number; totalPages: number };
    expect(res.data).toHaveLength(10);
    expect(res).toMatchObject({ total: 30, page: 2, limit: 10, totalPages: 3 });
    expect(prisma.producto.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
  });

  it('usa valores por defecto si solo llega page', async () => {
    const res = (await service.findAll(1)) as { limit: number };
    expect(res.limit).toBe(12);
  });

  it('limita el tamaño máximo de página y corrige valores inválidos', async () => {
    const res = (await service.findAll(-5, 99999)) as { page: number; limit: number };
    expect(res.page).toBe(1);
    expect(res.limit).toBe(100);
    const res2 = (await service.findAll(NaN, NaN)) as { page: number; limit: number };
    expect(res2).toMatchObject({ page: 1, limit: 12 });
  });
});
