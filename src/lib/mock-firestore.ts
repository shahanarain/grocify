import { MOCK_CATALOG } from './mock-catalog';

export interface MockStore {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  status: number;
}

export const INITIAL_STORES: MockStore[] = [
  {
    id: 'store-imtiaz',
    name: 'Imtiaz',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop&auto=format',
    followers: 28400,
    status: 1,
  },
  {
    id: 'store-metro',
    name: 'Metro',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&h=300&fit=crop&auto=format',
    followers: 21200,
    status: 1,
  },
  {
    id: 'store-chaseup',
    name: 'Chase Up',
    imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&h=300&fit=crop&auto=format',
    followers: 18900,
    status: 1,
  },
  {
    id: 'store-binhashim',
    name: 'Bin Hashim',
    imageUrl: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=500&h=300&fit=crop&auto=format',
    followers: 16400,
    status: 1,
  },
  {
    id: 'store-carrefour',
    name: 'Carrefour',
    imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=500&h=300&fit=crop&auto=format',
    followers: 24500,
    status: 1,
  },
  {
    id: 'store-al-fatah',
    name: 'Al-Fatah',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&h=300&fit=crop&auto=format',
    followers: 12800,
    status: 1,
  },
];

// Helper to resolve FieldValues like serverTimestamp or increment
function resolveFieldValue(val: any, existingVal?: any): any {
  if (val && typeof val === 'object') {
    const methodName = val.methodName || val._methodName;
    if (methodName === 'FieldValue.serverTimestamp' || methodName === 'serverTimestamp') {
      return new Date();
    }
    if (methodName === 'FieldValue.increment' || methodName === 'increment') {
      const operand = val.operand ?? val._operand;
      return (Number(existingVal) || 0) + (Number(operand) || 0);
    }
  }
  return val;
}

export class MockDocumentSnapshot {
  constructor(
    public readonly id: string,
    private readonly _data: Record<string, any> | undefined,
    public readonly ref: MockDocumentReference
  ) {}

  get exists(): boolean {
    return this._data !== undefined && this._data !== null;
  }

  data(): Record<string, any> | undefined {
    if (!this.exists) return undefined;
    return JSON.parse(JSON.stringify(this._data));
  }
}

export class MockQuerySnapshot {
  constructor(public readonly docs: MockDocumentSnapshot[]) {}

  get empty(): boolean {
    return this.docs.length === 0;
  }

  get size(): number {
    return this.docs.length;
  }

  forEach(callback: (result: MockDocumentSnapshot) => void): void {
    this.docs.forEach(callback);
  }
}

export class MockDocumentReference {
  constructor(
    public readonly id: string,
    public readonly path: string,
    private readonly _storage: Map<string, Record<string, any>>,
    private readonly _subcollections: Map<string, Map<string, MockDocumentReference>>
  ) {}

  async get(): Promise<MockDocumentSnapshot> {
    const data = this._storage.get(this.path);
    return new MockDocumentSnapshot(this.id, data, this);
  }

  async set(data: Record<string, any>, options?: { merge?: boolean }): Promise<void> {
    let finalData = data;
    if (options?.merge) {
      const existing = this._storage.get(this.path) || {};
      finalData = { ...existing };
      for (const [k, v] of Object.entries(data)) {
        finalData[k] = resolveFieldValue(v, existing[k]);
      }
    } else {
      finalData = {};
      for (const [k, v] of Object.entries(data)) {
        finalData[k] = resolveFieldValue(v);
      }
    }
    this._storage.set(this.path, finalData);
  }

  async update(data: Record<string, any>): Promise<void> {
    const existing = this._storage.get(this.path) || {};
    const updated = { ...existing };
    for (const [k, v] of Object.entries(data)) {
      updated[k] = resolveFieldValue(v, existing[k]);
    }
    this._storage.set(this.path, updated);
  }

  async delete(): Promise<void> {
    this._storage.delete(this.path);
  }

  collection(subCollectionName: string): MockCollectionReference {
    return new MockCollectionReference(
      `${this.path}/${subCollectionName}`,
      this._storage,
      this._subcollections
    );
  }
}

export class MockQuery {
  protected _filters: Array<{ field: string; op: string; value: any }> = [];
  protected _orderBys: Array<{ field: string; direction: 'asc' | 'desc' }> = [];
  protected _limitCount?: number;
  protected _startAfterDoc?: MockDocumentSnapshot | string;

  constructor(
    public readonly basePath: string,
    protected readonly _storage: Map<string, Record<string, any>>,
    protected readonly _subcollections: Map<string, Map<string, MockDocumentReference>>
  ) {}

  where(field: string, op: string, value: any): MockQuery {
    const next = this._clone();
    next._filters.push({ field, op, value });
    return next;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): MockQuery {
    const next = this._clone();
    next._orderBys.push({ field, direction });
    return next;
  }

  limit(count: number): MockQuery {
    const next = this._clone();
    next._limitCount = count;
    return next;
  }

  startAfter(doc: any): MockQuery {
    const next = this._clone();
    next._startAfterDoc = doc;
    return next;
  }

  protected _clone(): MockQuery {
    const q = new MockQuery(this.basePath, this._storage, this._subcollections);
    q._filters = [...this._filters];
    q._orderBys = [...this._orderBys];
    q._limitCount = this._limitCount;
    q._startAfterDoc = this._startAfterDoc;
    return q;
  }

  async get(): Promise<MockQuerySnapshot> {
    // Find all documents whose path is directly under this basePath: `${basePath}/${docId}`
    const prefix = `${this.basePath}/`;
    let docs: MockDocumentSnapshot[] = [];

    for (const [path, data] of this._storage.entries()) {
      if (path.startsWith(prefix)) {
        const remainder = path.substring(prefix.length);
        if (!remainder.includes('/')) {
          // direct child
          const docId = remainder;
          const ref = new MockDocumentReference(docId, path, this._storage, this._subcollections);
          docs.push(new MockDocumentSnapshot(docId, data, ref));
        }
      }
    }

    // Apply where filters
    for (const f of this._filters) {
      docs = docs.filter((d) => {
        const val = d.data()?.[f.field];
        if (f.op === '==') return val === f.value;
        if (f.op === '>=') return val >= f.value;
        if (f.op === '<=') return val <= f.value;
        if (f.op === '>') return val > f.value;
        if (f.op === '<') return val < f.value;
        if (f.op === 'array-contains') return Array.isArray(val) && val.includes(f.value);
        return true;
      });
    }

    // Apply orderBys
    for (const o of this._orderBys) {
      docs.sort((a, b) => {
        let va = a.data()?.[o.field];
        let vb = b.data()?.[o.field];
        if (va instanceof Date) va = va.getTime();
        if (vb instanceof Date) vb = vb.getTime();
        if (va === undefined || va === null) return 1;
        if (vb === undefined || vb === null) return -1;
        if (va < vb) return o.direction === 'asc' ? -1 : 1;
        if (va > vb) return o.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply startAfter
    if (this._startAfterDoc) {
      const targetId = typeof this._startAfterDoc === 'string'
        ? this._startAfterDoc
        : (this._startAfterDoc as any)?.id;
      const idx = docs.findIndex((d) => d.id === targetId);
      if (idx !== -1) {
        docs = docs.slice(idx + 1);
      }
    }

    // Apply limit
    if (typeof this._limitCount === 'number' && this._limitCount > 0) {
      docs = docs.slice(0, this._limitCount);
    }

    return new MockQuerySnapshot(docs);
  }
}

export class MockCollectionReference extends MockQuery {
  doc(docId?: string): MockDocumentReference {
    const id = docId || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const path = `${this.basePath}/${id}`;
    return new MockDocumentReference(id, path, this._storage, this._subcollections);
  }

  async add(data: Record<string, any>): Promise<MockDocumentReference> {
    const ref = this.doc();
    await ref.set(data);
    return ref;
  }
}

export class MockBatch {
  private _ops: Array<() => Promise<void>> = [];

  set(docRef: MockDocumentReference, data: Record<string, any>, options?: { merge?: boolean }): MockBatch {
    this._ops.push(() => docRef.set(data, options));
    return this;
  }

  update(docRef: MockDocumentReference, data: Record<string, any>): MockBatch {
    this._ops.push(() => docRef.update(data));
    return this;
  }

  delete(docRef: MockDocumentReference): MockBatch {
    this._ops.push(() => docRef.delete());
    return this;
  }

  async commit(): Promise<void> {
    for (const op of this._ops) {
      await op();
    }
  }
}

export class MockTransaction {
  constructor(private readonly _db: MockFirestore) {}

  async get(docRef: MockDocumentReference): Promise<MockDocumentSnapshot> {
    return docRef.get();
  }

  set(docRef: MockDocumentReference, data: Record<string, any>, options?: { merge?: boolean }): MockTransaction {
    docRef.set(data, options);
    return this;
  }

  update(docRef: MockDocumentReference, data: Record<string, any>): MockTransaction {
    docRef.update(data);
    return this;
  }

  delete(docRef: MockDocumentReference): MockTransaction {
    docRef.delete();
    return this;
  }
}

export class MockFirestore {
  private _storage = new Map<string, Record<string, any>>();
  private _subcollections = new Map<string, Map<string, MockDocumentReference>>();

  constructor() {
    this._seed();
  }

  collection(collectionName: string): MockCollectionReference {
    return new MockCollectionReference(collectionName, this._storage, this._subcollections);
  }

  batch(): MockBatch {
    return new MockBatch();
  }

  async runTransaction<T>(updateFunction: (transaction: MockTransaction) => Promise<T>): Promise<T> {
    const tx = new MockTransaction(this);
    return updateFunction(tx);
  }

  private _seed(): void {
    // 1. Seed stores
    for (const store of INITIAL_STORES) {
      this._storage.set(`stores/${store.id}`, { ...store });
    }

    // 2. Seed catalogProducts and products
    for (const p of MOCK_CATALOG) {
      this._storage.set(`catalogProducts/${p.canonicalId}`, { ...p });

      // Create product entries under products collection for each offer
      for (const off of p.offers) {
        const prodId = `${p.canonicalId}-${off.store.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        this._storage.set(`products/${prodId}`, {
          id: prodId,
          canonicalId: p.canonicalId,
          name: p.title,
          brand: p.brand,
          category: p.category,
          subCategory: p.subCategory,
          newPrice: off.price,
          oldPrice: p.maxPrice,
          discount: p.savingPct,
          quantity: p.quantity,
          imageUrl: p.image || null,
          supplier: off.store,
          status: 1,
          createdAt: new Date(),
          url: off.url || '#',
        });
      }
    }

    // 3. Seed demo user lists (users/demo-user-1/lists)
    const list1Id = 'list-weekly-essentials';
    this._storage.set(`users/demo-user-1/lists/${list1Id}`, {
      id: list1Id,
      name: 'Weekly Essentials',
      description: 'Regular dairy, vegetables, and pantry staples',
      productCount: 3,
      totalPrice: 555,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add products inside list 1
    const p1 = 'milk-full-cream-1l-metro';
    const p2 = 'eggs-12-tray-imtiaz';
    const p3 = 'bread-sandwich-400g-imtiaz';
    this._storage.set(`users/demo-user-1/lists/${list1Id}/products/${p1}`, { id: p1, addedAt: new Date() });
    this._storage.set(`users/demo-user-1/lists/${list1Id}/products/${p2}`, { id: p2, addedAt: new Date() });
    this._storage.set(`users/demo-user-1/lists/${list1Id}/products/${p3}`, { id: p3, addedAt: new Date() });

    const list2Id = 'list-weekend-bbq';
    this._storage.set(`users/demo-user-1/lists/${list2Id}`, {
      id: list2Id,
      name: 'Weekend BBQ & Drinks',
      description: 'Boneless chicken and drinks for family dinner',
      productCount: 2,
      totalPrice: 745,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    });
    const p4 = 'chicken-fresh-1kg-metro';
    const p5 = 'cola-pepsi-1-5l-metro';
    this._storage.set(`users/demo-user-1/lists/${list2Id}/products/${p4}`, { id: p4, addedAt: new Date() });
    this._storage.set(`users/demo-user-1/lists/${list2Id}/products/${p5}`, { id: p5, addedAt: new Date() });

    // 4. Seed demo user inventory (users/demo-user-1/inventory)
    const invItems = [
      {
        id: 'inv-milk',
        name: "Olper's Full Cream Milk",
        quantity: 1,
        unit: 'L',
        minThreshold: 2,
        category: 'Dairy',
        expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        updatedAt: new Date(),
      },
      {
        id: 'inv-eggs',
        name: 'Farm Fresh Eggs Tray',
        quantity: 4,
        unit: 'pcs',
        minThreshold: 6,
        category: 'Dairy',
        expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        updatedAt: new Date(),
      },
      {
        id: 'inv-flour',
        name: 'Sunridge Wheat Flour (Atta)',
        quantity: 5,
        unit: 'kg',
        minThreshold: 2,
        category: 'Home Essential',
        expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        updatedAt: new Date(),
      },
      {
        id: 'inv-tomato',
        name: 'Fresh Tomatoes',
        quantity: 0,
        unit: 'kg',
        minThreshold: 1,
        category: 'Fresh Products',
        expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
        updatedAt: new Date(),
      },
    ];

    for (const item of invItems) {
      this._storage.set(`users/demo-user-1/inventory/${item.id}`, item);
    }
  }
}

// Global singleton instance so changes persist across requests during the server lifecycle
export const mockDb = new MockFirestore();
(globalThis as any).mockFirestoreInstance = mockDb;
