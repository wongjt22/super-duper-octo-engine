import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wikipediaService } from "./wikipedia";
import { insertLandmarkSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get landmarks by map bounds
  app.get("/api/landmarks", async (req, res) => {
    try {
      const { north, south, east, west } = req.query;
      
      if (!north || !south || !east || !west) {
        return res.status(400).json({ error: "Missing bounds parameters: north, south, east, west" });
      }

      const northNum = parseFloat(north as string);
      const southNum = parseFloat(south as string);
      const eastNum = parseFloat(east as string);
      const westNum = parseFloat(west as string);

      if (isNaN(northNum) || isNaN(southNum) || isNaN(eastNum) || isNaN(westNum)) {
        return res.status(400).json({ error: "Invalid bounds parameters. Must be numbers." });
      }

      // First check cache for existing landmarks
      let landmarks = await storage.getLandmarksByBounds(northNum, southNum, eastNum, westNum);
      
      // If we don't have enough landmarks in cache, fetch from Wikipedia
      if (landmarks.length < 5) {
        const centerLat = (northNum + southNum) / 2;
        const centerLng = (eastNum + westNum) / 2;
        
        // Calculate radius based on bounds (approximate)
        const latDiff = Math.abs(northNum - southNum);
        const lngDiff = Math.abs(eastNum - westNum);
        const radius = Math.max(latDiff, lngDiff) * 111000; // Convert degrees to meters (rough approximation)
        
        const wikipediaLandmarks = await wikipediaService.searchLandmarksByCoordinates(
          centerLat, 
          centerLng, 
          Math.min(radius, 50000) // Cap at 50km
        );
        
        // Cache new landmarks
        for (const landmark of wikipediaLandmarks) {
          // Check if already exists
          const existing = await storage.getLandmarkByWikipediaId(landmark.wikipedia_page_id);
          if (!existing) {
            await storage.createLandmark(landmark);
          }
        }
        
        // Get updated landmarks from cache
        landmarks = await storage.getLandmarksByBounds(northNum, southNum, eastNum, westNum);
      }

      res.json(landmarks);
    } catch (error) {
      console.error("Error fetching landmarks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search landmarks by query
  app.get("/api/landmarks/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Missing search query parameter 'q'" });
      }

      const landmarks = await storage.searchLandmarks(q);
      res.json(landmarks);
    } catch (error) {
      console.error("Error searching landmarks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get landmark by ID
  app.get("/api/landmarks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const landmarks = await storage.getLandmarksByBounds(90, -90, 180, -180); // Get all landmarks
      const landmark = landmarks.find(l => l.id === id);
      
      if (!landmark) {
        return res.status(404).json({ error: "Landmark not found" });
      }

      res.json(landmark);
    } catch (error) {
      console.error("Error fetching landmark:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create a new landmark (for future admin functionality)
  app.post("/api/landmarks", async (req, res) => {
    try {
      const validatedData = insertLandmarkSchema.parse(req.body);
      const landmark = await storage.createLandmark(validatedData);
      res.status(201).json(landmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid landmark data", details: error.errors });
      }
      console.error("Error creating landmark:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}