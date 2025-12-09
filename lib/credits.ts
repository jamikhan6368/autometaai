import { prisma } from '@/lib/prisma';

/**
 * Deduct credits from a user's account
 * @param userId - The user's ID
 * @param amount - Number of credits to deduct
 * @returns The updated user object or null if insufficient credits
 */
export async function deductCredits(userId: string, amount: number = 1) {
  try {
    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has enough credits
    if (user.credits < amount) {
      return { success: false, error: 'Insufficient credits', credits: user.credits };
    }

    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount
        }
      },
      select: { credits: true }
    });

    return { success: true, credits: updatedUser.credits };
  } catch (error) {
    console.error('Error deducting credits:', error);
    throw error;
  }
}

/**
 * Check if user has enough credits
 * @param userId - The user's ID
 * @param amount - Number of credits needed
 * @returns Boolean indicating if user has enough credits
 */
export async function hasEnoughCredits(userId: string, amount: number = 1): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user) {
      return false;
    }

    return user.credits >= amount;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
}

/**
 * Get user's current credit balance
 * @param userId - The user's ID
 * @returns Current credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    return user?.credits || 0;
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
}
