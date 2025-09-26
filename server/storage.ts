import { type User, type InsertUser, type Landmark, type InsertLandmark } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Landmark operations
  getLandmarksByBounds(north: number, south: number, east: number, west: number): Promise<Landmark[]>;
  getLandmarkByWikipediaId(wikipediaPageId: string): Promise<Landmark | undefined>;
  createLandmark(landmark: InsertLandmark): Promise<Landmark>;
  searchLandmarks(query: string): Promise<Landmark[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private landmarks: Map<string, Landmark>;

  constructor() {
    this.users = new Map();
    this.landmarks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLandmarksByBounds(north: number, south: number, east: number, west: number): Promise<Landmark[]> {
    return Array.from(this.landmarks.values()).filter((landmark) => {
      const lat = parseFloat(landmark.latitude);
      const lng = parseFloat(landmark.longitude);
      return lat <= north && lat >= south && lng <= east && lng >= west;
    });
  }

  async getLandmarkByWikipediaId(wikipediaPageId: string): Promise<Landmark | undefined> {
    return Array.from(this.landmarks.values()).find(
      (landmark) => landmark.wikipedia_page_id === wikipediaPageId
    );
  }

  async createLandmark(insertLandmark: InsertLandmark): Promise<Landmark> {
    const id = randomUUID();
    const landmark: Landmark = { 
      ...insertLandmark, 
      id,
      description: insertLandmark.description ?? null,
      image_url: insertLandmark.image_url ?? null,
      category: insertLandmark.category ?? null,
      extract: insertLandmark.extract ?? null,
    };
    this.landmarks.set(id, landmark);
    return landmark;
  }

  async searchLandmarks(query: string): Promise<Landmark[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.landmarks.values()).filter((landmark) =>
      landmark.title.toLowerCase().includes(lowercaseQuery) ||
      (landmark.description && landmark.description.toLowerCase().includes(lowercaseQuery)) ||
      (landmark.category && landmark.category.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const storage = new MemStorage();
