import events from 'events';
import through2 from 'through2';
import httpHeaders from 'http-headers';

export default function createStreamHttpHeaderParser(inputStream) {
  let parsed = false;
  const headerEvents = new events.EventEmitter();

  const headerParserTransform = function (chunk, enc, callback) {
    if (!parsed) {
      parsed = true;
      headerEvents.emit('headers', httpHeaders(chunk));
    }
    callback(null, chunk);
  };

  const stream = through2(headerParserTransform);

  const headersPromise = new Promise(resolve => {
    headerEvents.once('headers', resolve);
  });

  inputStream.pipe(stream);

  return {
    stream,
    getHttpHeaders: () => headersPromise
  };
}
