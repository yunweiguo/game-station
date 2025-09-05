// Mock Prisma client for build purposes
export const prisma = {
  user: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  game: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  category: {
    findUnique: async (args?: Record<string, unknown>) => {
      const include = args?.include as any
      if (include?._count) {
        return { 
          id: '1', 
          name: 'Test', 
          slug: 'test', 
          description: '', 
          color: '', 
          icon: '', 
          featured: false, 
          sortOrder: 0, 
          createdAt: new Date(), 
          updatedAt: new Date(),
          _count: { games: 0 }
        }
      }
      return { id: '1', name: 'Test', slug: 'test', description: '', color: '', icon: '', featured: false, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }
    },
    findMany: async (args?: Record<string, unknown>) => {
      const include = args?.include as any
      if (include?._count) {
        return [{ 
          id: '1', 
          name: 'Test', 
          slug: 'test', 
          description: '', 
          color: '', 
          icon: '', 
          featured: false, 
          sortOrder: 0, 
          createdAt: new Date(), 
          updatedAt: new Date(),
          _count: { games: 0 }
        }]
      }
      return [{ id: '1', name: 'Test', slug: 'test', description: '', color: '', icon: '', featured: false, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }]
    },
    create: async (_args?: Record<string, unknown>) => ({ id: '1', name: 'Test', slug: 'test', description: '', color: '', icon: '', featured: false, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }),
    update: async (_args?: Record<string, unknown>) => ({ id: '1', name: 'Test', slug: 'test', description: '', color: '', icon: '', featured: false, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }),
    delete: async (_args?: Record<string, unknown>) => ({ id: '1', name: 'Test', slug: 'test', description: '', color: '', icon: '', featured: false, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() }),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  comment: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  rating: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  favorite: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
  report: {
    findUnique: async (_args?: Record<string, unknown>) => null,
    findMany: async (_args?: Record<string, unknown>) => [],
    create: async (_args?: Record<string, unknown>) => ({}),
    update: async (_args?: Record<string, unknown>) => ({}),
    delete: async (_args?: Record<string, unknown>) => ({}),
    count: async (_args?: Record<string, unknown>) => 0,
  },
}