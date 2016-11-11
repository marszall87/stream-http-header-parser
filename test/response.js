import stream from 'stream';
import test from 'ava';
import createStreamHttpHeaderParser from '../src';
import streamToString from './helpers/stream-to-string';

test('status code parsing', async t => {
  const inputStream = new stream.PassThrough();
  inputStream.end(`HTTP/1.1 200 OK\r\n`);

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const httpHeaders = await headerParser.getHttpHeaders();

  t.is(httpHeaders.statusCode, 200);
});

test('content length parsing', async t => {
  const inputStream = new stream.PassThrough();
  inputStream.end(`HTTP/1.1 200 OK\r\nContent-Length: 123`);

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const httpHeaders = await headerParser.getHttpHeaders();

  t.is(httpHeaders.headers['content-length'], '123');
});

test('stream forwarding', async t => {
  const inputResponseHeader = `HTTP/1.1 200 OK\r\nContent-Length: 9\r\n\r\n`;
  const inputResponseBody = `some body`;
  const inputStream = new stream.PassThrough();
  inputStream.write(inputResponseHeader);
  inputStream.write(inputResponseBody);
  inputStream.end();

  const headerParser = createStreamHttpHeaderParser(inputStream);
  const outputStream = headerParser.stream;
  const outputResponse = await streamToString(outputStream);

  t.is(outputResponse, inputResponseHeader + inputResponseBody);
});
