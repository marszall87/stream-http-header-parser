export default function streamToString(stream, length) {
  return new Promise(resolve => {
    let output = '';
    stream.on('data', chunk => {
      output += chunk.toString();
      if (output.length >= length) {
        resolve(output);
      }
    });
    stream.on('end', () => resolve(output));
  });
}
