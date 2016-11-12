import events from 'events';
import through2 from 'through2';
import duplexify from 'duplexify';
import httpHeaders from 'http-headers';

export default function parseHttpHeader(callback) {
  return socket => {
    let parsed = false;
    const headerEvents = new events.EventEmitter();

    const headerParserTransform = function (chunk, enc, callback) {
      if (!parsed) {
        parsed = true;
        headerEvents.emit('headers', httpHeaders(chunk));
      }
      callback(null, chunk);
    };

    const transfromStream = through2(headerParserTransform);

    headerEvents.once('headers', headers => {
      callback(headers, duplexify(socket, transfromStream));
    });

    socket.pipe(transfromStream);
  };
}
