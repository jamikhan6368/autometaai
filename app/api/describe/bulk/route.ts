import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user';
import { ImageDescriptionProcessor } from '@/lib/image-description-processor';
import { generateBulkDescriptionsFile } from '@/lib/file-generator';
import { prisma } from '@/lib/prisma';

// Simple session management for progress tracking
const activeSessions = new Map<string, {
  startTime: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    const aiProvider = (formData.get('aiProvider') as string) || 'ideogram';

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Create a unique session ID for this request
    const sessionId = `${user.id}-${Date.now()}`;
    activeSessions.set(sessionId, { startTime: Date.now() });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Initialize the processor with the selected provider
          const processor = new ImageDescriptionProcessor(user.id, {
            provider: aiProvider as 'ideogram' | 'gemini',
            stopOnInsufficientCredits: true
          });


          // Use the built-in streaming method from processor
          const summary = await processor.processImagesWithStreaming(
            images,
            (update) => {
              send(update);
            }
          );

          // After processing all segments, generate the batch file if successful
          if (summary.successful > 0) {
            const successfulResults = summary.results.filter(r => r.success);
            const batchFileUrl = await generateBulkDescriptionsFile(
              successfulResults.map(r => ({
                filename: r.filename,
                description: r.description || '',
                confidence: r.confidence || 95,
                source: r.source || aiProvider
              })),
              new Date()
            );

            // Save batch operation record (only if file was generated)
            if (batchFileUrl) {
              await prisma.batchOperation.create({
                data: {
                  userId: user.id,
                  type: 'describe',
                  itemCount: summary.successful,
                  fileUrl: batchFileUrl,
                },
              });
            }

            // Send one final completion update with the batch file URL
            send({
              type: 'complete',
              summary,
              batchFileUrl: batchFileUrl || undefined
            });
          }

          controller.close();
        } catch (error) {
          console.error('Streaming processing error:', error);
          send({ type: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
          controller.close();
        } finally {
          activeSessions.delete(sessionId);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Bulk describe setup error:', error);
    return NextResponse.json({ error: 'Failed to start processing' }, { status: 500 });
  }
}
