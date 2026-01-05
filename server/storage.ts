/**
 * Storage utility for S3 via Manus Storage Proxy
 */

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

export async function storagePut(
  key: string,
  data: Buffer | string,
  contentType: string = "application/octet-stream"
): Promise<string> {
  try {
    const formData = new FormData();
    
    const blob = typeof data === "string" 
      ? new Blob([data], { type: contentType })
      : new Blob([data], { type: contentType });
    
    formData.append("file", blob, key);
    formData.append("key", key);

    const response = await fetch(`${FORGE_API_URL}/v1/storage/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FORGE_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Storage upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url || key;
  } catch (error) {
    console.error("Error uploading to storage:", error);
    throw error;
  }
}

export async function storageGet(key: string): Promise<string> {
  try {
    const response = await fetch(`${FORGE_API_URL}/v1/storage/downloadUrl?key=${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${FORGE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Storage download URL failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
}
