import stream from 'stream';
import test from 'ava';
import createHeaderParser from '../src';
import streamToString from './helpers/stream-to-string';

test.beforeEach(t => {
  t.context.connection = new stream.PassThrough();
});

test('status code parsing', async t => {
  t.context.connection.write(`HTTP/1.1 200 OK\r\n`);
  return new Promise(resolve => {
    createHeaderParser(headers => {
      t.is(headers.statusCode, 200);
      resolve();
    })(t.context.connection);
  });
});

test('content length parsing', async t => {
  t.context.connection.write(`HTTP/1.1 200 OK\r\nContent-Length: 123`);
  return new Promise(resolve => {
    createHeaderParser(headers => {
      t.is(headers.headers['content-length'], '123');
      resolve();
    })(t.context.connection);
  });
});

test('stream forwarding', async t => {
  const inputResponseHeader = `HTTP/1.1 200 OK\r\nContent-Length: 9\r\n\r\n`;
  const inputResponseBody = `test body`;
  t.context.connection.write(inputResponseHeader);
  t.context.connection.write(inputResponseBody);
  return new Promise(resolve => {
    createHeaderParser(async(headers, stream) => {
      const outputRequest = await streamToString(stream, inputResponseHeader.length + inputResponseBody.length);
      t.is(outputRequest, inputResponseHeader + inputResponseBody);
      resolve();
    })(t.context.connection);
  });
});
