# stream-http-header-parser

> Parse HTTP header in TCP stream

## Install

```
$ npm install --save stream-http-header-parser
```

## Usage
```js
const net = require('net');
const createHeaderParser = require('stream-http-header-parser');

net.createServer(createHeaderParser((headers, stream) => {
  if (headers.method === 'GET') {
    stream.on('data', chunk => {
      const data = chunk.toString();
      stream.end(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${data.length}\r\n\r\n${data}`);
    });
  } else {
    stream.end(`HTTP/1.1 404 Not Found`);
  }
})).listen(3000);
```

## API

### createHeaderParser(callback)

Returns a `Function` that should be called with a `stream.Duplex` (e.g. `net.Socket`) that you want to parse.

#### callback(headers, stream)

Type: `Function`

The callback will be called after HTTP headers are parsed. `headers` is an object with the actual headers
(see [http-headers](https://github.com/watson/http-headers) for details). `stream` is a `stream.Duplex`
and it's basically a wrapper around the original stream. Note that the `stream` will output all the data
from the original stream, **including the headers**.

## Dependencies

- [http-headers](https://github.com/watson/http-headers)
- [duplexify](https://github.com/mafintosh/duplexify)
- [through2](https://github.com/rvagg/through2)

## License

MIT © [Michał Nykiel](https://github.com/marszall87)
