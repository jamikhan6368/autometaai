import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { getApiKey } from '@/lib/getApiKey';
import { deductCredits } from '@/lib/credits';
import { prisma } from '@/lib/prisma';

import { generateRunwayPromptsWithGemini } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user with credits and AI provider preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < 1) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: 1,
          available: user.credits,
          message: 'You need at least 1 credit to generate runway prompts.'
        },
        { status: 402 }
      );
    }

    // Use Gemini for runway prompts
    const geminiKey = await getApiKey('GEMINI_API_KEY');
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please ask admin to add it.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const mode = (formData.get('mode') as string) || 'runway';
    const skipHistory = formData.get('skipHistory') === 'true';

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Use Gemini for runway prompts
    const geminiResult = await generateRunwayPromptsWithGemini(imageFile);
    const lowResult = geminiResult.low || '';
    const mediumResult = geminiResult.medium || '';
    const highResult = geminiResult.high || '';


    // Build final Runway prompts with camera movements
    const buildPrompt = (motion: string, clause: string) => {
      if (!clause) return '';

      // Ensure clause starts naturally
      if (!/^(the|a|an)\b/i.test(clause)) {
        clause = 'the subject ' + clause;
      }

      // Choose camera style based on motion intensity
      let prefix = '';
      if (motion === 'low') {
        prefix = 'a smooth dolly camera moves slowly toward ';
      } else if (motion === 'high') {
        prefix = 'a dynamic handheld camera moves quickly toward ';
      } else {
        prefix = 'a steady tracking camera moves forward toward ';
      }

      return (prefix + clause + ' cinematic live-action').replace(/\s+/g, ' ').trim();
    };

    // Deduct 1 credit for successful processing
    const creditResult = await deductCredits(user.id, 1);

    if (!creditResult.success) {
      return NextResponse.json(
        { error: creditResult.error || 'Failed to deduct credits' },
        { status: 402 }
      );
    }

    const lowPrompt = buildPrompt('low', lowResult);
    const mediumPrompt = buildPrompt('medium', mediumResult);
    const highPrompt = buildPrompt('high', highResult);

    // Save to history only if not part of a batch
    if (!skipHistory) {
      try {
        await prisma.runwayPrompt.create({
          data: {
            userId: user.id,
            filename: imageFile.name,
            mode: mode,
            lowMotion: mode === 'runway' ? lowPrompt : null,
            mediumMotion: mode === 'runway' ? mediumPrompt : null,
            highMotion: mode === 'runway' ? highPrompt : null,
            description: null,
            fileSize: imageFile.size,
            mimeType: imageFile.type,
          },
        });
      } catch (historyError) {
        console.error('Failed to save runway prompt history:', historyError);
        // Don't fail the request if history save fails
      }
    }

    return NextResponse.json({
      low: lowPrompt,
      medium: mediumPrompt,
      high: highPrompt,
      creditsRemaining: creditResult.credits,
    });
  } catch (error: unknown) {
    console.error('Runway prompt error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
