const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');

/**
 * @param {string} videoUrl - The local file path of the video to clip
 * @param {Array<{ start: number, end: number }>} timeIndexes - The array of time indexes to clip from the video
 * @param {string} outputFilePath - The local file path to save the composite video clip
 */
async function createCompositeVideoClip(videoUrl, timeIndexes, outputFilePath) {
  // Create a list of FFmpeg commands to concatenate the clips
  const commands = [];
  for (const { start, end } of timeIndexes) {
    const duration = end - start;
    commands.push(`-ss ${start} -i ${videoUrl} -t ${duration}`);
  }
  const command = `${ffmpeg} ${commands.join(' ')} -filter_complex concat=n=${timeIndexes.length}:v=1:a=0 -y ${outputFilePath}`;

  // Spawn a child process to execute the FFmpeg command
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true });

    // Log any errors from FFmpeg
    child.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    // Resolve the promise when the child process completes
    child.on('close', (code) => {
      if (code !== 0) {
        reject(`FFmpeg exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
}

// Example usage:
createCompositeVideoClip('./LWTRonDesantis.mp4', [{ start: 0, end: 5 }, { start: 10, end: 15 }], './resultvid.mp4')
  .then(() => console.log('Composite video clip created successfully'))
  .catch((error) => console.error('Failed to create composite video clip:', error));
