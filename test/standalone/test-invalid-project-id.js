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

delete process.env.GCLOUD_PROJECT;

var assert = require('assert');
var agent = require('../..');

describe('index.js', function() {
  it('should complain when config.projectId is not a string or number', function() {
    agent.start({projectId: 0, enabled: true, logLevel: 0});
    assert(agent.isActive());
    agent.stop();
    agent.start({projectId: {test: false}, enabled: true, logLevel: 0});
    assert(!agent.isActive());
  });
});
