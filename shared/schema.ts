import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const landmarks = pgTable("landmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wikipedia_page_id: text("wikipedia_page_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  image_url: text("image_url"),
  category: text("category"),
  extract: text("extract"),
  wikipedia_url: text("wikipedia_url").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").references(() => users.id),
  map_center_lat: numeric("map_center_lat", { precision: 10, scale: 7 }),
  map_center_lng: numeric("map_center_lng", { precision: 10, scale: 7 }),
  zoom_level: integer("zoom_level"),
  favorite_landmarks: text("favorite_landmarks").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLandmarkSchema = createInsertSchema(landmarks).omit({
  id: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLandmark = z.infer<typeof insertLandmarkSchema>;
export type Landmark = typeof landmarks.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
