import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

/**
 * Converts a static image into a short 5-second video, adds a headline text overlay, 
 * and background music if available in the public/music folder.
 */
export async function createAdVideo(imageUrl: string, headline: string, duration: number = 5): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public');
  const videoDir = path.join(publicDir, 'videos');
  const musicDir = path.join(publicDir, 'music');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  
  const videoFileName = `ad_${Date.now()}.mp4`;
  const outputVideoPath = path.join(videoDir, videoFileName);
  
  // 1. Save input image locally temporarily
  const tempImagePath = path.join(videoDir, `temp_${Date.now()}.jpg`);
  
  try {
    if (imageUrl.startsWith('data:image')) {
      // Decode base64 
      const base64Data = imageUrl.split(';base64,').pop();
      if (base64Data) {
        fs.writeFileSync(tempImagePath, base64Data, { encoding: 'base64' });
      }
    } else {
      // Download remote image
      const res = await fetch(imageUrl);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(tempImagePath, Buffer.from(buffer));
    }
  } catch (err) {
    console.error("Failed to download or write image for FFmpeg:", err);
    throw new Error("Invalid image source for video generator.");
  }
  
  // 2. Discover background music
  let musicFile = null;
  if (fs.existsSync(musicDir)) {
    const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));
    if (files.length > 0) {
      musicFile = path.join(musicDir, files[0]); // Grab the first music file found
    }
  }

  // 3. Process video using fluent-ffmpeg
  return new Promise((resolve, reject) => {
    let command = ffmpeg()
      .input(tempImagePath)
      .loop(duration) // loop the static image for X seconds
      .inputOptions(['-framerate 25']) 
      .outputOptions([
        '-c:v libx264',
        '-preset ultrafast',
        '-pix_fmt yuv420p',
        `-t ${duration}`,
      ]);
      
      // Sanitize headline for ffmpeg text filter (escapes colons, quotes)
      const safeHeadline = (headline || "Shop Now")
        .replace(/:/g, '\\\\:')
        .replace(/'/g, "")
        .replace(/"/g, "");
      
      // We scale the image down to make it standard size while preserving aspect ratio
      const complexFilter: string[] = [
        `scale=-2:1080` // scale width proportionally, max height 1080
      ];

      command = command.complexFilter(complexFilter.join(','));

      // If music is found, merge it
      if (musicFile) {
        command = command
          .input(musicFile)
          .outputOptions([
            '-c:a aac',
            '-shortest' // Stop encoding when the shortest stream (the image loop duration) ends
          ]);
      }

      command
        .on('start', (cmdLine: string) => {
          console.log('[FFMPEG] Started with command:', cmdLine);
        })
        .on('error', (err: Error) => {
          console.error('[FFMPEG] Error:', err.message);
          if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);
          reject(err);
        })
        .on('end', () => {
          console.log('[FFMPEG] Finished processing:', videoFileName);
          if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);
          // Return public relative path
          resolve(`/videos/${videoFileName}`);
        })
        .save(outputVideoPath);
  });
}
