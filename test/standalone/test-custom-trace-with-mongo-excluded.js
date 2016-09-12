/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Prereqs:
// Start docker daemon
//   ex) docker -d
// Run a mongo image binding the mongo port
//   ex) docker run -p 27017:27017 -d mongo
var agent = require('../..').start({ samplingRate: 0, excludedHooks: ['mongodb-core'], stackTraceLimit: 0 });

var common = require('../hooks/common.js');

var assert = require('assert');
var express = require('../hooks/fixtures/express4');
var http = require('http');

describe.only('express + custom traces and mongodb-core hook excluded', function() {
  it('should work', function(done) {
    var app = express();
    app.get('/', function (req, res) {
      var span = agent.startSpan('test-span');
      setTimeout(function() {
        res.send('Hello World');
        agent.endSpan(span);
      }, 50);
    });
    var server = app.listen(common.serverPort, function() {
      var headers = {};
      headers['x-cloud-trace-context'] = '42/1729;o=1';
      http.get({port: common.serverPort, headers: headers}, function(res) {
        res.on('data', function() {});
        res.on('end', function() {
          var traces = common.getTraces();
          console.log('TRACES', traces);
          console.log('SPANS', JSON.stringify(traces[0].spans));
          // assert.equal(common.getTraces().length, expectedTraceCount);
          common.cleanTraces();
          server.close();
          done();
        });
      });
    });
  });
});
