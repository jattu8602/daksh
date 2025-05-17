const { PrismaClient } = require('@prisma/client');
const { spawn } = require('child_process');

const prisma = new PrismaClient();
const MAX_RETRIES = 3;
const UPLOAD_TIMEOUT = 300000; // 5 minutes in milliseconds
const RETRY_DELAY = 5000; // 5 seconds

async function updateJobProgress(jobId, progress, stage) {
  try {
    await prisma.videoJob.update({
      where: { id: jobId },
      data: {
        progress: progress,
        currentStage: stage
      }
    });
  } catch (error) {
    console.error(`Failed to update progress for job ${jobId}:`, error);
  }
}

async function processJob(job) {
  console.log(`Processing job ${job.id} for URL: ${job.url}`);
  try {
    await prisma.videoJob.update({
      where: { id: job.id },
      data: {
        status: 'processing',
        progress: 0,
        currentStage: 'starting'
      }
    });
  } catch (error) {
    console.error('Failed to update job status:', error);
    return;
  }

  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const result = await processJobWithTimeout(job);
      return result;
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed for job ${job.id}:`, error.message);

      if (retryCount === MAX_RETRIES) {
        try {
          await prisma.videoJob.update({
            where: { id: job.id },
            data: {
              status: 'error',
              error: `Upload failed after ${MAX_RETRIES} attempts: ${error.message}`,
              result: null,
              progress: 0,
              currentStage: 'failed'
            }
          });
        } catch (updateError) {
          console.error('Failed to update job error status:', updateError);
        }
        return;
      }

      console.log(`Retrying job ${job.id} in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

function processJobWithTimeout(job) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['video_processor/video_processor.py', job.url]);
    let output = '';
    let error = '';
    let timeoutId;
    let lastJsonOutput = null;

    // Set timeout
    timeoutId = setTimeout(() => {
      python.kill();
      reject(new Error('Upload timed out after 5 minutes'));
    }, UPLOAD_TIMEOUT);

    python.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log('PYTHON STDOUT:', chunk);

      // Parse progress updates
      try {
        // Look for progress updates in the format: PROGRESS:{"stage":"downloading","progress":45}
        const progressMatch = chunk.match(/PROGRESS:(\{.*?\})/);
        if (progressMatch) {
          const progressData = JSON.parse(progressMatch[1]);
          if (progressData.stage && typeof progressData.progress === 'number') {
            updateJobProgress(job.id, progressData.progress, progressData.stage);
          }
        }

        // Try to find JSON output in the chunk
        const jsonMatch = chunk.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            const jsonData = JSON.parse(jsonMatch[0]);
            if (Array.isArray(jsonData) && jsonData.length > 0) {
              lastJsonOutput = jsonData;
            }
          } catch (e) {
            // Ignore JSON parsing errors for progress messages
          }
        }
      } catch (e) {
        // Ignore parsing errors for progress messages
      }
    });

    python.stderr.on('data', (data) => {
      const chunk = data.toString();
      error += chunk;
      console.error('PYTHON STDERR:', chunk);
    });

    python.on('close', async (code) => {
      clearTimeout(timeoutId);

      if (code !== 0) {
        reject(new Error(`Python script failed with exit code ${code}: ${error}`));
        return;
      }

      try {
        if (!lastJsonOutput) {
          throw new Error('No valid JSON output found in script response');
        }

        const firstResult = lastJsonOutput[0];
        if (!firstResult || typeof firstResult !== 'object') {
          throw new Error('Invalid result format: expected object in array');
        }

        if (firstResult.status === 'success') {
          try {
            await prisma.videoJob.update({
              where: { id: job.id },
              data: {
                status: 'success',
                result: firstResult,
                error: null,
                progress: 100,
                currentStage: 'completed'
              }
            });
            console.log(`Job ${job.id} completed successfully:`, firstResult);

            // Create a new Video record after successful job
            try {
              const metadata = firstResult.metadata || {};
              await prisma.video.create({
                data: {
                  title: metadata.title || 'Untitled',
                  source: metadata.source_platform || 'unknown',
                  url: metadata.upload_url || job.url
                }
              });
            } catch (videoError) {
              console.error('Failed to create Video record:', videoError);
            }

            resolve();
          } catch (updateError) {
            console.error('Failed to update job success status:', updateError);
            reject(updateError);
          }
        } else {
          const error = firstResult.error || 'Unknown error in result';
          reject(new Error(error));
        }
      } catch (e) {
        reject(new Error(`Failed to parse script output: ${e.message}`));
      }
    });

    python.on('error', (err) => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

async function main() {
  while (true) {
    try {
      const job = await prisma.videoJob.findFirst({
        where: { status: 'pending' },
        orderBy: { createdAt: 'asc' }
      });

      if (job) {
        await processJob(job);
      } else {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds before polling again
      }
    } catch (error) {
      console.error('Error in main loop:', error);
      await new Promise(r => setTimeout(r, 5000)); // Wait before retrying
    }
  }
}

main().catch((e) => {
  console.error('Worker crashed:', e);
  process.exit(1);
});