export default function streamToString(stream) {
  return new Promise(resolve => {
    let output = '';
    stream.on('data', chunk => {
      output += chunk.toString();
    });
    stream.on('end', () => resolve(output));
  });
}
