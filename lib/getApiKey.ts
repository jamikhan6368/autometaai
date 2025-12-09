import { prisma } from '@/lib/prisma';

/**
 * Get API key from database first, fallback to environment variable
 * This allows the app to work even if .env keys are deleted
 */
export async function getApiKey(keyName: string): Promise<string | null> {
  try {
    // First, try to get from database
    const setting = await prisma.settings.findUnique({
      where: { key: keyName }
    });

    if (setting && setting.value && setting.isActive) {
      return setting.value;
    }

    // Fallback to environment variable
    const envKey = process.env[keyName];
    if (envKey) {
      return envKey;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching API key ${keyName}:`, error);
    
    // If database fails, try environment variable
    const envKey = process.env[keyName];
    return envKey || null;
  }
}
