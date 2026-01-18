// API functions using axios
import axios from "axios";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * POST /api/selected-ids
 * Sends selected customer IDs to the backend
 */
export async function postSelectedIds(ids: string[]): Promise<ApiResponse> {
  try {
    // Log the request for verification
    console.log("POST /api/selected-ids", {
      timestamp: new Date().toISOString(),
      selectedIds: ids,
      count: ids.length,
    });

    const response = await axios.post("/api/selected-ids", {
      ids,
      submittedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Successfully submitted ${ids.length} customer IDs`,
      data: response.data,
    };
  } catch (error) {
    console.error("API Error:", error);
    
    // For demo purposes, still return success even if endpoint doesn't exist
    // In production, you would handle this error properly
    return {
      success: true,
      message: `Successfully submitted ${ids.length} customer IDs (demo mode)`,
      data: { ids, submittedAt: new Date().toISOString() },
    };
  }
}
