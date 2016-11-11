import stream from 'stream';
import test from 'ava';
import createStreamHttpHeaderParser from '../src';
import streamToString from './helpers/stream-to-string';

test('method parsing', async t => {
  const inputStream = new stream.PassThrough();
  inputStream.end(`GET /index.html HTTP/1.1\r\nHost: www.test.com`);

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const httpHeaders = await headerParser.getHttpHeaders();

  t.is(httpHeaders.method, 'GET');
});

test('host parsing', async t => {
  const inputStream = new stream.PassThrough();
  inputStream.end(`GET /index.html HTTP/1.1\r\nHost: www.test.com`);

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const httpHeaders = await headerParser.getHttpHeaders();

  t.is(httpHeaders.headers.host, 'www.test.com');
});

test('stream forwarding', async t => {
  const inputRequest = `POST /index.html HTTP/1.1\r\nHost: www.test.com\r\n\r\ntest body`;
  const inputStream = new stream.PassThrough();
  inputStream.end(inputRequest);

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const outputStream = headerParser.stream;
  const outputRequest = await streamToString(outputStream);

  t.is(outputRequest, inputRequest);
});
