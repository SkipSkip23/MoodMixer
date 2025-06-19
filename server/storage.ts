import { users, userUsage, type User, type InsertUser, type UserUsage, type InsertUserUsage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserUsage(uid: string): Promise<UserUsage | undefined>;
  createUserUsage(usage: InsertUserUsage): Promise<UserUsage>;
  updateUserUsage(uid: string, updates: Partial<UserUsage>): Promise<UserUsage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userUsages: Map<string, UserUsage>;
  private currentId: number;
  private currentUsageId: number;

  constructor() {
    this.users = new Map();
    this.userUsages = new Map();
    this.currentId = 1;
    this.currentUsageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserUsage(uid: string): Promise<UserUsage | undefined> {
    return this.userUsages.get(uid);
  }

  async createUserUsage(insertUsage: InsertUserUsage): Promise<UserUsage> {
    const id = this.currentUsageId++;
    const usage: UserUsage = { 
      id,
      uid: insertUsage.uid,
      requestCount: insertUsage.requestCount ?? 0,
      lastReset: insertUsage.lastReset,
      adsWatched: insertUsage.adsWatched ?? 0,
      isPremium: insertUsage.isPremium ?? false,
      premiumExpiry: insertUsage.premiumExpiry ?? null,
      showPremiumOffer: insertUsage.showPremiumOffer ?? false
    };
    this.userUsages.set(insertUsage.uid, usage);
    return usage;
  }

  async updateUserUsage(uid: string, updates: Partial<UserUsage>): Promise<UserUsage> {
    const existing = this.userUsages.get(uid);
    if (!existing) {
      throw new Error(`User usage not found for uid: ${uid}`);
    }
    const updated = { ...existing, ...updates };
    this.userUsages.set(uid, updated);
    return updated;
  }
}

export const storage = new MemStorage();
