import { type InsertLandmark } from "@shared/schema";

export interface WikipediaPage {
  pageid: number;
  title: string;
  extract?: string;
  coordinates?: Array<{
    lat: number;
    lon: number;
  }>;
  thumbnail?: {
    source: string;
  };
  fullurl: string;
}

export interface WikipediaGeoSearchResult {
  query: {
    geosearch: Array<{
      pageid: number;
      title: string;
      lat: number;
      lon: number;
      dist: number;
    }>;
  };
}

export class WikipediaService {
  private readonly baseUrl = "https://en.wikipedia.org/api/rest_v1";
  private readonly apiUrl = "https://en.wikipedia.org/w/api.php";

  async searchLandmarksByCoordinates(
    latitude: number,
    longitude: number,
    radius: number = 10000 // 10km radius
  ): Promise<InsertLandmark[]> {
    try {
      // First, get pages near the coordinates
      const geoSearchUrl = new URL(this.apiUrl);
      geoSearchUrl.searchParams.set("action", "query");
      geoSearchUrl.searchParams.set("list", "geosearch");
      geoSearchUrl.searchParams.set("gscoord", `${latitude}|${longitude}`);
      geoSearchUrl.searchParams.set("gsradius", radius.toString());
      geoSearchUrl.searchParams.set("gslimit", "50");
      geoSearchUrl.searchParams.set("format", "json");
      geoSearchUrl.searchParams.set("origin", "*");

      const geoResponse = await fetch(geoSearchUrl);
      if (!geoResponse.ok) {
        throw new Error(`Wikipedia geo search failed: ${geoResponse.statusText}`);
      }

      const geoData: WikipediaGeoSearchResult = await geoResponse.json();
      const pages = geoData.query?.geosearch || [];

      // Get detailed information for each page
      const landmarks: InsertLandmark[] = [];
      
      for (const page of pages.slice(0, 20)) { // Limit to 20 landmarks per request
        try {
          const pageInfo = await this.getPageDetails(page.pageid);
          if (pageInfo) {
            const landmark: InsertLandmark = {
              wikipedia_page_id: page.pageid.toString(),
              title: pageInfo.title,
              description: pageInfo.extract?.substring(0, 500) || "",
              latitude: page.lat.toString(),
              longitude: page.lon.toString(),
              image_url: pageInfo.thumbnail?.source || null,
              category: this.categorizeFromTitle(pageInfo.title),
              extract: pageInfo.extract || "",
              wikipedia_url: pageInfo.fullurl,
            };
            landmarks.push(landmark);
          }
        } catch (error) {
          console.warn(`Failed to get details for page ${page.pageid}:`, error);
        }
      }

      return landmarks;
    } catch (error) {
      console.error("Error searching Wikipedia landmarks:", error);
      return [];
    }
  }

  async getPageDetails(pageId: number): Promise<WikipediaPage | null> {
    try {
      const detailsUrl = new URL(this.apiUrl);
      detailsUrl.searchParams.set("action", "query");
      detailsUrl.searchParams.set("pageids", pageId.toString());
      detailsUrl.searchParams.set("prop", "extracts|pageimages|info");
      detailsUrl.searchParams.set("exintro", "true");
      detailsUrl.searchParams.set("explaintext", "true");
      detailsUrl.searchParams.set("exsectionformat", "plain");
      detailsUrl.searchParams.set("piprop", "thumbnail");
      detailsUrl.searchParams.set("pithumbsize", "300");
      detailsUrl.searchParams.set("inprop", "url");
      detailsUrl.searchParams.set("format", "json");
      detailsUrl.searchParams.set("origin", "*");

      const response = await fetch(detailsUrl);
      if (!response.ok) {
        throw new Error(`Wikipedia page details failed: ${response.statusText}`);
      }

      const data = await response.json();
      const pages = data.query?.pages || {};
      const pageData = Object.values(pages)[0] as any;

      if (!pageData || pageData.missing) {
        return null;
      }

      return {
        pageid: pageData.pageid,
        title: pageData.title,
        extract: pageData.extract,
        thumbnail: pageData.thumbnail,
        fullurl: pageData.fullurl,
      };
    } catch (error) {
      console.error(`Error getting page details for ${pageId}:`, error);
      return null;
    }
  }

  private categorizeFromTitle(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes("church") || titleLower.includes("cathedral") || 
        titleLower.includes("temple") || titleLower.includes("mosque") ||
        titleLower.includes("synagogue")) {
      return "religious";
    }
    
    if (titleLower.includes("museum") || titleLower.includes("gallery") ||
        titleLower.includes("theater") || titleLower.includes("theatre") ||
        titleLower.includes("opera") || titleLower.includes("concert")) {
      return "cultural";
    }
    
    if (titleLower.includes("park") || titleLower.includes("garden") ||
        titleLower.includes("forest") || titleLower.includes("lake") ||
        titleLower.includes("mountain") || titleLower.includes("river")) {
      return "natural";
    }
    
    if (titleLower.includes("castle") || titleLower.includes("fort") ||
        titleLower.includes("palace") || titleLower.includes("historic") ||
        titleLower.includes("monument") || titleLower.includes("memorial")) {
      return "historical";
    }
    
    if (titleLower.includes("university") || titleLower.includes("college") ||
        titleLower.includes("school") || titleLower.includes("library")) {
      return "educational";
    }
    
    return "landmark";
  }
}

export const wikipediaService = new WikipediaService();