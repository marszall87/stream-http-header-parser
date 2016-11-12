import stream from 'stream';
import test from 'ava';
import createHeaderParser from '../src';
import streamToString from './helpers/stream-to-string';

test.beforeEach(t => {
  t.context.connection = new stream.PassThrough();
});

test('method parsing', t => {
  t.context.connection.write(`GET /index.html HTTP/1.1\r\nHost: www.test.com`);
  return new Promise(resolve => {
    createHeaderParser(headers => {
      t.is(headers.method, 'GET');
      resolve();
    })(t.context.connection);
  });
});

test('host parsing', t => {
  t.context.connection.write(`GET /index.html HTTP/1.1\r\nHost: www.test.com`);
  return new Promise(resolve => {
    createHeaderParser(headers => {
      t.is(headers.headers.host, 'www.test.com');
      resolve();
    })(t.context.connection);
  });
});

test('stream forwarding', t => {
  const inputRequestHeader = `POST /index.html HTTP/1.1\r\nHost: www.test.com\r\nContent-Length: 9\r\n\r\n`;
  const inputRequestBody = `test body`;
  t.context.connection.write(inputRequestHeader);
  t.context.connection.write(inputRequestBody);
  return new Promise(resolve => {
    createHeaderParser(async(headers, stream) => {
      const outputRequest = await streamToString(stream, inputRequestHeader.length + inputRequestBody.length);
      t.is(outputRequest, inputRequestHeader + inputRequestBody);
      resolve();
    })(t.context.connection);
  });
});
