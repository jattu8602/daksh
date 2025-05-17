import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const urls = body.urls;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of video URLs' },
        { status: 400 }
      );
    }

    // Validate URLs
    const validUrls = urls.filter((url) => {
      try {
        new URL(url);
        return url.includes('youtube.com') ||
               url.includes('youtu.be') ||
               url.includes('instagram.com');
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid video URLs provided' },
        { status: 400 }
      );
    }

    // Run the Python script
    const scriptPath = path.join(process.cwd(), 'video_processor', 'video_processor.py');
    const pythonProcess = spawn('python', [scriptPath, ...validUrls]);

    return new Promise((resolve) => {
      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { error: `Process failed: ${error}` },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const results = JSON.parse(output);
          resolve(NextResponse.json({ results }));
        } catch (e) {
          resolve(
            NextResponse.json(
              { error: 'Failed to parse script output' },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
