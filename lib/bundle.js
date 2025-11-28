/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "42644f50ef97e8e705e4"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
  function Board(stage) {
    _classCallCheck(this, Board);

    this.stage = stage;
  }

  _createClass(Board, [{
    key: "openModal",
    value: function openModal() {
      $(document.getElementById("instructionModal")).addClass('visible');
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      $(document.getElementById("instructionModal")).removeClass('visible');
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      var LstaticLeftArrow = new createjs.Bitmap("./assets/images/staticLeft.png");
      var LstaticDownArrow = new createjs.Bitmap("./assets/images/staticDown.png");
      var LstaticUpArrow = new createjs.Bitmap("./assets/images/staticUp.png");
      var LstaticRightArrow = new createjs.Bitmap("./assets/images/staticRight.png");

      var RstaticLeftArrow = new createjs.Bitmap("./assets/images/staticLeft.png");
      var RstaticDownArrow = new createjs.Bitmap("./assets/images/staticDown.png");
      var RstaticUpArrow = new createjs.Bitmap("./assets/images/staticUp.png");
      var RstaticRightArrow = new createjs.Bitmap("./assets/images/staticRight.png");

      LstaticLeftArrow.x = 25;LstaticLeftArrow.y = 600;
      LstaticDownArrow.x = 100;LstaticDownArrow.y = 600;
      LstaticUpArrow.x = 175;LstaticUpArrow.y = 600;
      LstaticRightArrow.x = 250;LstaticRightArrow.y = 600;

      RstaticLeftArrow.x = 400;RstaticLeftArrow.y = 600;
      RstaticDownArrow.x = 475;RstaticDownArrow.y = 600;
      RstaticUpArrow.x = 550;RstaticUpArrow.y = 600;
      RstaticRightArrow.x = 625;RstaticRightArrow.y = 600;

      RstaticRightArrow.image.onload = function () {
        return _this.stage.update();
      };

      this.stage.addChild(LstaticLeftArrow, LstaticDownArrow, LstaticUpArrow, LstaticRightArrow, RstaticLeftArrow, RstaticDownArrow, RstaticUpArrow, RstaticRightArrow);

      this.stage.update();
    }
  }]);

  return Board;
}();

module.exports = Board;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arrow = __webpack_require__(2);

var _arrow2 = _interopRequireDefault(_arrow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(stage) {
    var _this = this;

    _classCallCheck(this, Game);

    this.stage = stage;
    this.started = false;
    this.paused = false;
    this.LleftArrows = [];
    this.LdownArrows = [];
    this.LupArrows = [];
    this.LrightArrows = [];
    this.RleftArrows = [];
    this.RdownArrows = [];
    this.RupArrows = [];
    this.RrightArrows = [];
    this.play = this.play.bind(this);
    this.music = new Audio('./assets/songs/paranoia.mp3');
    this.music.loop = true;
    this.music.volume = 0.1;

    // 음악이 끝날 때 이벤트 처리
    this.music.addEventListener('ended', function () {
      if (_this.started && !_this.paused) {
        _this.endGame();
      }
    });
    this.youtubePlayer = null;
    this.reset();

    // URL 파라미터 처리
    this.handleUrlParams();

    // Pause 메뉴 이벤트
    document.getElementById("resumeBtn").addEventListener("click", function () {
      _this.resumeGame();
    });

    document.getElementById("mainMenuBtn").addEventListener("click", function () {
      window.location.href = "index.html";
    });

    // Game Over 메뉴 이벤트
    document.getElementById("playAgainBtn").addEventListener("click", function () {
      _this.playAgain();
    });

    document.getElementById("goToMainBtn").addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  _createClass(Game, [{
    key: 'loadYouTubeVideo',
    value: function loadYouTubeVideo(url) {
      var _this2 = this;

      // YouTube URL에서 비디오 ID 추출
      var videoId = this.extractVideoId(url);
      if (!videoId) {
        alert('유효한 YouTube URL을 입력해주세요.');
        return;
      }

      // 기존 플레이어가 있으면 제거
      if (this.youtubePlayer) {
        this.youtubePlayer.destroy();
      }

      // YouTube 모드일 때 canvas는 유지하되, 배경만 투명하게 설정
      var canvas = document.getElementById('canvas');
      if (canvas) {
        canvas.style.background = 'transparent';
      }

      // YouTube iframe API를 사용하여 백그라운드에서 재생
      this.youtubePlayer = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'controls': 0,
          'disablekb': 1,
          'enablejsapi': 1,
          'fs': 0,
          'iv_load_policy': 3,
          'modestbranding': 1,
          'playsinline': 1,
          'rel': 0,
          'showinfo': 0
        },
        events: {
          'onReady': function onReady(event) {
            console.log('YouTube video loaded');
            // 음악 볼륨을 0으로 설정하여 YouTube 오디오만 들리도록
            _this2.music.volume = 0;
            // YouTube 비디오 자동 재생 시도
            event.target.playVideo();
            _this2.youtubeReady = true;
          },
          'onStateChange': function onStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
              console.log('YouTube video started playing');
            } else if (event.data === YT.PlayerState.ENDED) {
              console.log('YouTube video ended');
              _this2.endGame();
            }
          }
        }
      });
      this.youtubeReady = false;
    }
  }, {
    key: 'extractVideoId',
    value: function extractVideoId(url) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    }
  }, {
    key: 'handleUrlParams',
    value: function handleUrlParams() {
      var _this3 = this;

      var urlParams = new URLSearchParams(window.location.search);
      var difficulty = urlParams.get('difficulty') || 'standard';
      var gameMode = urlParams.get('mode') || 'multi';
      var youtubeUrl = urlParams.get('youtube');
      var song = urlParams.get('song');

      // 게임 모드 설정
      this.gameMode = gameMode;

      if (youtubeUrl) {
        setTimeout(function () {
          return _this3.loadYouTubeVideo(youtubeUrl);
        }, 500);
      } else if (song) {
        this.music.src = './assets/songs/' + song;
      }

      // Single player 모드일 때 Player 2 점수 숨기기
      if (gameMode === 'single') {
        var player2Container = document.getElementById('player2ScoreContainer');
        if (player2Container) {
          player2Container.style.display = 'none';
        }

        // Player 1 점수 컨테이너를 중앙으로 이동
        var player1Container = document.getElementById('player1ScoreContainer');
        if (player1Container) {
          player1Container.style.left = '50%';
          player1Container.style.transform = 'translateX(-50%)';
          player1Container.style.right = 'auto';
        }
      }

      // 자동으로 게임 시작
      setTimeout(function () {
        _this3.play(difficulty);
      }, 1000);
    }
  }, {
    key: 'pauseGame',
    value: function pauseGame() {
      this.paused = true;
      this.music.pause();
      if (this.youtubePlayer) {
        this.youtubePlayer.pauseVideo();
      }
      createjs.Ticker.paused = true;
      document.getElementById("pauseModal").classList.add("visible");
    }
  }, {
    key: 'resumeGame',
    value: function resumeGame() {
      this.paused = false;
      this.music.play();
      if (this.youtubePlayer) {
        this.youtubePlayer.playVideo();
      }
      createjs.Ticker.paused = false;
      document.getElementById("pauseModal").classList.remove("visible");
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.score = 0;
      this.player1Score = 0;
      this.player2Score = 0;
      this.updateScore();
      this.updatePlayerScores();
      this.clearArrows();
      createjs.Ticker.removeAllEventListeners();
      this.stage.update();
      clearInterval(this.myInt);
      clearTimeout(this.musicEndTimeout);
    }
  }, {
    key: 'clearArrows',
    value: function clearArrows() {
      var _this4 = this;

      this.LleftArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.LdownArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.LupArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.LrightArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.RleftArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.RdownArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.RupArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.RrightArrows.forEach(function (arrow) {
        _this4.stage.removeChild(arrow);
      });
      this.LleftArrows = [];
      this.LdownArrows = [];
      this.LupArrows = [];
      this.LrightArrows = [];
      this.RleftArrows = [];
      this.RdownArrows = [];
      this.RupArrows = [];
      this.RrightArrows = [];
    }
  }, {
    key: 'play',
    value: function play(difficulty) {
      var _this5 = this;

      this.started = true;
      var speed = void 0;
      switch (difficulty) {
        case "light":
          speed = 3.5;
          break;
        case "standard":
          speed = 7.0;
          break;
        case "heavy":
          speed = 7.0;
          break;
      }

      this.reset();
      clearTimeout(this.t1);
      clearTimeout(this.t2);
      clearTimeout(this.t3);
      clearTimeout(this.t4);
      clearTimeout(this.musicEndTimeout);
      this.music.play();

      // YouTube 비디오가 준비되었고 아직 재생되지 않았다면 재생 시작
      if (this.youtubePlayer && this.youtubeReady) {
        try {
          this.youtubePlayer.playVideo();
        } catch (error) {
          console.log('YouTube video play failed, will retry on user interaction:', error);
        }
      }

      var that = this;

      setInterval(function () {
        speed *= 1.0007;
      }, 100);
      this.myInt = setInterval(randomGen, 7000 / 3 / speed);

      this.t1 = setTimeout(function () {
        clearInterval(_this5.myInt);
        if (_this5.life > 0) {
          _this5.myInt = setInterval(randomGen, 7500 / 3 / speed);
        }
      }, 52500);

      this.t2 = setTimeout(function () {
        clearInterval(_this5.myInt);
        if (_this5.life > 0) {
          _this5.myInt = setInterval(randomGen, 8000 / 3 / speed);
        }
      }, 105000);

      this.t3 = setTimeout(function () {
        clearInterval(_this5.myInt);
        if (_this5.life > 0) {
          _this5.myInt = setInterval(randomGen, 8500 / 3 / speed);
        }
      }, 157500);

      this.t4 = setTimeout(function () {
        clearInterval(_this5.myInt);
        if (_this5.life > 0) {
          _this5.myInt = setInterval(randomGen, 9000 / 3 / speed);
        }
      }, 210000);

      // 음악이 로드된 후 화살표 생성을 조절
      var setupMusicEnd = function setupMusicEnd() {
        if (_this5.music.duration && !isNaN(_this5.music.duration)) {
          // 음악이 끝나기 5초 전에 화살표 생성을 멈춤
          var stopTime = (_this5.music.duration - 5) * 1000;
          if (stopTime > 0) {
            _this5.musicEndTimeout = setTimeout(function () {
              clearInterval(_this5.myInt);
            }, stopTime);
          }
        }
      };

      // 음악이 로드되면 설정
      if (this.music.readyState >= 2) {
        setupMusicEnd();
      } else {
        this.music.addEventListener('loadedmetadata', setupMusicEnd);
      }

      var tick = createjs.Ticker;
      tick.setFPS(30);

      var LcreateLeftArrow = function LcreateLeftArrow() {
        var leftMovingArrow = new _arrow2.default.LleftArrow();
        that.LleftArrows.push(leftMovingArrow);
        that.stage.addChild(leftMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", leftTick);
        leftMovingArrow.listener = listener;

        function leftTick(event) {
          leftMovingArrow.y = leftMovingArrow.y + speed;
          if (that.LleftArrows[0] && that.LleftArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.LleftArrows[0]);
            that.LleftArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var LcreateDownArrow = function LcreateDownArrow() {
        var downMovingArrow = new _arrow2.default.LdownArrow();
        that.LdownArrows.push(downMovingArrow);
        that.stage.addChild(downMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", downTick);
        downMovingArrow.listener = listener;

        function downTick(event) {
          downMovingArrow.y = downMovingArrow.y + speed;
          if (that.LdownArrows[0] && that.LdownArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.LdownArrows[0]);
            that.LdownArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var LcreateUpArrow = function LcreateUpArrow() {
        var upMovingArrow = new _arrow2.default.LupArrow();
        that.LupArrows.push(upMovingArrow);
        that.stage.addChild(upMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", upTick);
        upMovingArrow.listener = listener;

        function upTick(event) {
          upMovingArrow.y = upMovingArrow.y + speed;
          if (that.LupArrows[0] && that.LupArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.LupArrows[0]);
            that.LupArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var LcreateRightArrow = function LcreateRightArrow() {
        var rightMovingArrow = new _arrow2.default.LrightArrow();
        that.LrightArrows.push(rightMovingArrow);
        that.stage.addChild(rightMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", rightTick);
        rightMovingArrow.listener = listener;

        function rightTick(event) {
          rightMovingArrow.y = rightMovingArrow.y + speed;
          if (that.LrightArrows[0] && that.LrightArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.LrightArrows[0]);
            that.LrightArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var RcreateLeftArrow = function RcreateLeftArrow() {
        var leftMovingArrow = new _arrow2.default.RleftArrow();
        // Single Player 모드일 때 화살표를 중앙으로 이동
        if (that.gameMode === 'single') {
          leftMovingArrow.x = 25; // 중앙 왼쪽 위치
        }
        that.RleftArrows.push(leftMovingArrow);
        that.stage.addChild(leftMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", leftTick);
        leftMovingArrow.listener = listener;

        function leftTick(event) {
          leftMovingArrow.y = leftMovingArrow.y + speed;
          if (that.RleftArrows[0] && that.RleftArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.RleftArrows[0]);
            that.RleftArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var RcreateDownArrow = function RcreateDownArrow() {
        var downMovingArrow = new _arrow2.default.RdownArrow();
        // Single Player 모드일 때 화살표를 중앙으로 이동
        if (that.gameMode === 'single') {
          downMovingArrow.x = 100; // 중앙 아래 위치
        }
        that.RdownArrows.push(downMovingArrow);
        that.stage.addChild(downMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", downTick);
        downMovingArrow.listener = listener;

        function downTick(event) {
          downMovingArrow.y = downMovingArrow.y + speed;
          if (that.RdownArrows[0] && that.RdownArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.RdownArrows[0]);
            that.RdownArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var RcreateUpArrow = function RcreateUpArrow() {
        var upMovingArrow = new _arrow2.default.RupArrow();
        // Single Player 모드일 때 화살표를 중앙으로 이동
        if (that.gameMode === 'single') {
          upMovingArrow.x = 175; // 중앙 위 위치
        }
        that.RupArrows.push(upMovingArrow);
        that.stage.addChild(upMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", upTick);
        upMovingArrow.listener = listener;

        function upTick(event) {
          upMovingArrow.y = upMovingArrow.y + speed;
          if (that.RupArrows[0] && that.RupArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.RupArrows[0]);
            that.RupArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      var RcreateRightArrow = function RcreateRightArrow() {
        var rightMovingArrow = new _arrow2.default.RrightArrow();
        // Single Player 모드일 때 화살표를 중앙으로 이동
        if (that.gameMode === 'single') {
          rightMovingArrow.x = 250; // 중앙 오른쪽 위치
        }
        that.RrightArrows.push(rightMovingArrow);
        that.stage.addChild(rightMovingArrow);
        that.stage.update();
        var listener = tick.on("tick", rightTick);
        rightMovingArrow.listener = listener;

        function rightTick(event) {
          rightMovingArrow.y = rightMovingArrow.y + speed;
          if (that.RrightArrows[0] && that.RrightArrows[0].y > 760) {
            that.miss();
            that.stage.removeChild(that.RrightArrows[0]);
            that.RrightArrows.shift();
            tick.off("tick", listener);
          }
          that.stage.update(event);
        }
      };

      function randomGen() {
        var randArrow = Math.floor(Math.random() * 8) + 1; // 더 다양한 패턴을 위해 8개로 확장
        var randDouble = Math.random() * 100 + 1;

        // 난이도에 따른 노트 밀도 조절
        if (difficulty === "heavy") {
          if (randDouble > 60) {
            // heavy에서는 더 많은 노트
            randArrow += 4;
          }
        } else if (difficulty === "standard") {
          if (randDouble > 75) {
            // standard에서는 중간 밀도
            randArrow += 4;
          }
        } else {
          // light
          if (randDouble > 85) {
            // light에서는 적은 노트
            randArrow += 4;
          }
        }

        // Single player 모드일 때는 오른쪽 화살표만 생성
        if (that.gameMode === 'single') {
          switch (randArrow) {
            case 1:
              RcreateLeftArrow();break;
            case 2:
              RcreateDownArrow();break;
            case 3:
              RcreateUpArrow();break;
            case 4:
              RcreateRightArrow();break;
            case 5:
              break; // 빈 공간
            case 6:
              break; // 빈 공간
            case 7:
              break; // 빈 공간
            case 8:
              break; // 빈 공간
            case 9:
              break; // 빈 공간
            case 10:
              break; // 빈 공간
            case 11:
              break; // 빈 공간
            case 12:
              break; // 빈 공간
            default:
              break;
          }
        } else {
          // Multi player 모드일 때는 양쪽 화살표 모두 생성
          switch (randArrow) {
            case 1:
              RcreateLeftArrow();break;
            case 2:
              RcreateDownArrow();break;
            case 3:
              RcreateUpArrow();break;
            case 4:
              RcreateRightArrow();break;
            case 5:
              break; // 빈 공간
            case 6:
              LcreateLeftArrow();break;
            case 7:
              LcreateDownArrow();break;
            case 8:
              LcreateUpArrow();break;
            case 9:
              LcreateRightArrow();break;
            case 10:
              break; // 빈 공간
            case 11:
              break; // 빈 공간
            case 12:
              break; // 빈 공간
            default:
              break;
          }
        }
      }
    }
  }, {
    key: 'check',
    value: function check(arrows, direction) {
      var _this6 = this;

      // 첫 번째 키 입력 시 YouTube 비디오 재생 시도 (사용자 상호작용)
      if (this.youtubePlayer && this.youtubeReady) {
        try {
          var playerState = this.youtubePlayer.getPlayerState();
          if (playerState === YT.PlayerState.UNSTARTED || playerState === YT.PlayerState.PAUSED) {
            this.youtubePlayer.playVideo();
          }
        } catch (error) {
          console.log('YouTube video play attempt:', error);
        }
      }

      var pressed = void 0;
      var isPlayer1 = direction.startsWith('l_'); // l_로 시작하면 Player 1

      // Single Player 모드에서는 항상 Player 1로 처리
      if (this.gameMode === 'single') {
        isPlayer1 = true;
      }

      switch (direction) {
        case "l_left":
          pressed = new _arrow2.default.LleftPressedArrow();
          break;
        case "l_down":
          pressed = new _arrow2.default.LdownPressedArrow();
          break;
        case "l_up":
          pressed = new _arrow2.default.LupPressedArrow();
          break;
        case "l_right":
          pressed = new _arrow2.default.LrightPressedArrow();
          break;
        case "r_left":
          pressed = new _arrow2.default.RleftPressedArrow();
          // Single Player 모드일 때는 중앙 위치로 이동
          if (this.gameMode === 'single') {
            pressed.x = 25;
          }
          break;
        case "r_down":
          pressed = new _arrow2.default.RdownPressedArrow();
          // Single Player 모드일 때는 중앙 위치로 이동
          if (this.gameMode === 'single') {
            pressed.x = 100;
          }
          break;
        case "r_up":
          pressed = new _arrow2.default.RupPressedArrow();
          // Single Player 모드일 때는 중앙 위치로 이동
          if (this.gameMode === 'single') {
            pressed.x = 175;
          }
          break;
        case "r_right":
          pressed = new _arrow2.default.RrightPressedArrow();
          // Single Player 모드일 때는 중앙 위치로 이동
          if (this.gameMode === 'single') {
            pressed.x = 250;
          }
          break;
      }
      this.stage.addChild(pressed);
      this.stage.update();
      setTimeout(function () {
        return _this6.stage.removeChild(pressed);
      }, 100);

      if (arrows[0] && arrows[0].y > 585 && arrows[0].y < 615) {
        this.hit("excellent", isPlayer1);
        createjs.Ticker.off("tick", arrows[0].listener);
        this.stage.removeChild(arrows[0]);
        arrows.shift();
      } else if (arrows[0] && arrows[0].y > 570 && arrows[0].y < 630) {
        this.hit("great", isPlayer1);
        createjs.Ticker.off("tick", arrows[0].listener);
        this.stage.removeChild(arrows[0]);
        arrows.shift();
      } else if (arrows[0]) {
        // 화살표가 있지만 타이밍이 맞지 않을 때만 miss
        this.miss(isPlayer1);
      }
    }
  }, {
    key: 'hit',
    value: function hit(tier, isPlayer1) {
      var _this7 = this;

      var hitMessageBorder = void 0;
      var hitMessage = void 0;
      var points = 0;

      if (tier === "excellent") {
        points = 100;
        hitMessageBorder = new createjs.Text("Excellent!", "40px Impact", "black");
        hitMessageBorder.outline = 2;
        hitMessage = hitMessageBorder.clone();
        hitMessage.outline = 0;
        hitMessage.color = "#ffff80";
      } else if (tier === "great") {
        points = 50;
        hitMessageBorder = new createjs.Text("Great!", "40px Impact", "black");
        hitMessageBorder.outline = 2;
        hitMessage = hitMessageBorder.clone();
        hitMessage.outline = 0;
        hitMessage.color = "#80ff80";
      }

      // 플레이어별 위치 설정
      if (isPlayer1) {
        hitMessageBorder.x = 100; // Player 1 영역 (왼쪽)
        hitMessageBorder.y = 225;
        hitMessage.x = 100;
        hitMessage.y = 225;
      } else {
        hitMessageBorder.x = 500; // Player 2 영역 (오른쪽)
        hitMessageBorder.y = 225;
        hitMessage.x = 500;
        hitMessage.y = 225;
      }

      // 플레이어별 점수 업데이트
      if (isPlayer1) {
        this.player1Score += points;
      } else {
        this.player2Score += points;
      }

      this.stage.addChild(hitMessage, hitMessageBorder);
      this.stage.update();
      setTimeout(function () {
        _this7.stage.removeChild(hitMessage, hitMessageBorder);
      }, 200);

      this.updatePlayerScores();
    }
  }, {
    key: 'miss',
    value: function miss(isPlayer1) {
      var _this8 = this;

      // 플레이어별 점수 감소 (마이너스 가능)
      if (isPlayer1) {
        this.player1Score -= 20;
      } else {
        this.player2Score -= 20;
      }

      var missMessageBorder = new createjs.Text("Missed...", "40px Impact", "black");
      missMessageBorder.outline = 2;
      var missMessage = missMessageBorder.clone();
      missMessage.outline = 0;
      missMessage.color = "red";

      // 플레이어별 위치 설정
      if (isPlayer1) {
        missMessageBorder.x = 100; // Player 1 영역 (왼쪽)
        missMessageBorder.y = 275;
        missMessage.x = 100;
        missMessage.y = 275;
      } else {
        missMessageBorder.x = 500; // Player 2 영역 (오른쪽)
        missMessageBorder.y = 275;
        missMessage.x = 500;
        missMessage.y = 275;
      }

      this.stage.addChild(missMessage, missMessageBorder);
      this.stage.update();

      setTimeout(function () {
        _this8.stage.removeChild(missMessage, missMessageBorder);
      }, 200);

      this.updatePlayerScores();
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      this.showGameOverModal();
      this.clearArrows();
      this.music.pause();
      if (this.youtubePlayer) {
        this.youtubePlayer.pauseVideo();
      }
      clearInterval(this.myInt);
      clearTimeout(this.t1);
      clearTimeout(this.t2);
      clearTimeout(this.t3);
      clearTimeout(this.t4);
      clearTimeout(this.musicEndTimeout);
    }
  }, {
    key: 'endGame',
    value: function endGame() {
      // YouTube 비디오가 끝났을 때 게임 종료
      this.showGameOverModal(true); // true는 곡 완주를 의미
      this.clearArrows();
      this.music.pause();
      if (this.youtubePlayer) {
        this.youtubePlayer.pauseVideo();
      }
      clearInterval(this.myInt);
      clearTimeout(this.t1);
      clearTimeout(this.t2);
      clearTimeout(this.t3);
      clearTimeout(this.t4);
      clearTimeout(this.musicEndTimeout);
    }
  }, {
    key: 'updateScore',
    value: function updateScore() {
      var score = document.getElementById("score");
      if (score) {
        score.innerHTML = this.score;
      }
    }
  }, {
    key: 'updatePlayerScores',
    value: function updatePlayerScores() {
      var player1Score = document.getElementById("player1Score");
      var player2Score = document.getElementById("player2Score");
      if (player1Score) {
        player1Score.innerHTML = this.player1Score;
      }
      if (player2Score) {
        player2Score.innerHTML = this.player2Score;
      }
    }
  }, {
    key: 'showGameOverModal',
    value: function showGameOverModal() {
      var isSongComplete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      // 최종 점수 업데이트
      document.getElementById("finalPlayer1Score").innerHTML = this.player1Score;
      document.getElementById("finalPlayer2Score").innerHTML = this.player2Score;

      // Single Player 모드일 때 Player 2 점수 숨기기
      if (this.gameMode === 'single') {
        var player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
        if (player2ScoreElement) {
          player2ScoreElement.style.display = 'none';
        }
        // Single Player에서는 Player 1 점수만 총점으로 표시
        document.getElementById("finalTotalScore").innerHTML = this.player1Score;
      } else {
        var _player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
        if (_player2ScoreElement) {
          _player2ScoreElement.style.display = 'block';
        }
        // Multi Player에서는 두 플레이어 점수 합계
        document.getElementById("finalTotalScore").innerHTML = this.player1Score + this.player2Score;
      }

      // 게임 오버 모달 제목 변경
      var gameOverTitle = document.querySelector("#gameOverModal h2");
      if (isSongComplete) {
        gameOverTitle.innerHTML = "SONG COMPLETE!";
        gameOverTitle.style.color = "#00ff00";
      } else {
        gameOverTitle.innerHTML = "GAME OVER!";
        gameOverTitle.style.color = "#ff0000";
      }

      // 모달 표시
      document.getElementById("gameOverModal").classList.add("visible");
    }
  }, {
    key: 'playAgain',
    value: function playAgain() {
      var _this9 = this;

      // 모달 숨기기
      document.getElementById("gameOverModal").classList.remove("visible");

      // Single Player 모드일 때 Player 2 점수 다시 표시 (게임 재시작을 위해)
      if (this.gameMode === 'single') {
        var player2ScoreElement = document.querySelector("#gameOverModal .final-scores .player-score:last-child");
        if (player2ScoreElement) {
          player2ScoreElement.style.display = 'block';
        }
      }

      // 게임 리셋 및 재시작
      this.reset();

      // URL 파라미터에서 난이도 가져오기
      var urlParams = new URLSearchParams(window.location.search);
      var difficulty = urlParams.get('difficulty') || 'standard';

      // 게임 재시작
      setTimeout(function () {
        _this9.play(difficulty);
      }, 500);
    }
  }]);

  return Game;
}();

exports.default = Game;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LleftArrow = function LleftArrow() {
  _classCallCheck(this, LleftArrow);

  var leftArrow = new createjs.Bitmap("./assets/images/lh_left.png");
  leftArrow.x = 25;
  leftArrow.y = 0;
  this.listener = "";
  return leftArrow;
};

var LdownArrow = function LdownArrow() {
  _classCallCheck(this, LdownArrow);

  var downArrow = new createjs.Bitmap("./assets/images/lh_down.png");
  downArrow.x = 100;
  downArrow.y = 0;
  this.listener = "";
  return downArrow;
};

var LupArrow = function LupArrow() {
  _classCallCheck(this, LupArrow);

  var upArrow = new createjs.Bitmap("./assets/images/lh_up.png");
  upArrow.x = 175;
  upArrow.y = 0;
  this.listener = "";
  return upArrow;
};

var LrightArrow = function LrightArrow() {
  _classCallCheck(this, LrightArrow);

  var rightArrow = new createjs.Bitmap("./assets/images/lh_right.png");
  rightArrow.x = 250;
  rightArrow.y = 0;
  this.listener = "";
  return rightArrow;
};

var LleftPressedArrow = function LleftPressedArrow() {
  _classCallCheck(this, LleftPressedArrow);

  var leftPressed = new createjs.Bitmap("./assets/images/staticLeftPressed.png");
  leftPressed.x = 25;
  leftPressed.y = 600;
  leftPressed.scaleX = 1.0;
  leftPressed.scaleY = 1.0;
  return leftPressed;
};

var LdownPressedArrow = function LdownPressedArrow() {
  _classCallCheck(this, LdownPressedArrow);

  var downPressed = new createjs.Bitmap("./assets/images/staticDownPressed.png");
  downPressed.x = 100;
  downPressed.y = 600;
  downPressed.scaleX = 1.0;
  downPressed.scaleY = 1.0;
  return downPressed;
};

var LupPressedArrow = function LupPressedArrow() {
  _classCallCheck(this, LupPressedArrow);

  var upPressed = new createjs.Bitmap("./assets/images/staticUpPressed.png");
  upPressed.x = 175;
  upPressed.y = 600;
  upPressed.scaleX = 1.0;
  upPressed.scaleY = 1.0;
  return upPressed;
};

var LrightPressedArrow = function LrightPressedArrow() {
  _classCallCheck(this, LrightPressedArrow);

  var rightPressed = new createjs.Bitmap("./assets/images/staticRightPressed.png");
  rightPressed.x = 250;
  rightPressed.y = 600;
  rightPressed.scaleX = 1.0;
  rightPressed.scaleY = 1.0;
  return rightPressed;
};

var RleftArrow = function RleftArrow() {
  _classCallCheck(this, RleftArrow);

  var leftArrow = new createjs.Bitmap("./assets/images/rh_left.png");
  leftArrow.x = 400;
  leftArrow.y = 0;
  this.listener = "";
  return leftArrow;
};

var RdownArrow = function RdownArrow() {
  _classCallCheck(this, RdownArrow);

  var downArrow = new createjs.Bitmap("./assets/images/rh_down.png");
  downArrow.x = 475;
  downArrow.y = 0;
  this.listener = "";
  return downArrow;
};

var RupArrow = function RupArrow() {
  _classCallCheck(this, RupArrow);

  var upArrow = new createjs.Bitmap("./assets/images/rh_up.png");
  upArrow.x = 550;
  upArrow.y = 0;
  this.listener = "";
  return upArrow;
};

var RrightArrow = function RrightArrow() {
  _classCallCheck(this, RrightArrow);

  var rightArrow = new createjs.Bitmap("./assets/images/rh_right.png");
  rightArrow.x = 625;
  rightArrow.y = 0;
  this.listener = "";
  return rightArrow;
};

var RleftPressedArrow = function RleftPressedArrow() {
  _classCallCheck(this, RleftPressedArrow);

  var leftPressed = new createjs.Bitmap("./assets/images/staticLeftPressed.png");
  leftPressed.x = 400;
  leftPressed.y = 600;
  leftPressed.scaleX = 1.0;
  leftPressed.scaleY = 1.0;
  return leftPressed;
};

var RdownPressedArrow = function RdownPressedArrow() {
  _classCallCheck(this, RdownPressedArrow);

  var downPressed = new createjs.Bitmap("./assets/images/staticDownPressed.png");
  downPressed.x = 475;
  downPressed.y = 600;
  downPressed.scaleX = 1.0;
  downPressed.scaleY = 1.0;
  return downPressed;
};

var RupPressedArrow = function RupPressedArrow() {
  _classCallCheck(this, RupPressedArrow);

  var upPressed = new createjs.Bitmap("./assets/images/staticUpPressed.png");
  upPressed.x = 550;
  upPressed.y = 600;
  upPressed.scaleX = 1.0;
  upPressed.scaleY = 1.0;
  return upPressed;
};

var RrightPressedArrow = function RrightPressedArrow() {
  _classCallCheck(this, RrightPressedArrow);

  var rightPressed = new createjs.Bitmap("./assets/images/staticRightPressed.png");
  rightPressed.x = 625;
  rightPressed.y = 600;
  rightPressed.scaleX = 1.0;
  rightPressed.scaleY = 1.0;
  return rightPressed;
};

exports.default = {
  LleftArrow: LleftArrow,
  LdownArrow: LdownArrow,
  LupArrow: LupArrow,
  LrightArrow: LrightArrow,
  LleftPressedArrow: LleftPressedArrow,
  LdownPressedArrow: LdownPressedArrow,
  LupPressedArrow: LupPressedArrow,
  LrightPressedArrow: LrightPressedArrow,
  RleftArrow: RleftArrow,
  RdownArrow: RdownArrow,
  RupArrow: RupArrow,
  RrightArrow: RrightArrow,
  RleftPressedArrow: RleftPressedArrow,
  RdownPressedArrow: RdownPressedArrow,
  RupPressedArrow: RupPressedArrow,
  RrightPressedArrow: RrightPressedArrow
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _board = __webpack_require__(0);

var _board2 = _interopRequireDefault(_board);

var _game = __webpack_require__(1);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {
  var stage = new createjs.Stage("canvas");
  var board = new _board2.default(stage);
  window.board = board;
  board.draw();
  stage.update();

  var game = new _game2.default(stage);

  function LhandlePress(e) {
    console.log('Key pressed:', e.keyCode, e.key); // 디버깅용

    // ESC 키로 pause
    if (e.keyCode === 27) {
      if (game.started && !game.paused) {
        game.pauseGame();
      } else if (game.paused) {
        game.resumeGame();
      }
      return;
    }

    // Single player 모드일 때는 왼쪽 키 무시
    if (game.gameMode === 'single') {
      return;
    }

    if (game.started && !game.paused) {
      switch (e.keyCode) {
        case 65: // A 키 (대문자)
        case 97:
          // a 키 (소문자)
          game.check(game.LleftArrows, "l_left");
          break;
        case 83: // S 키 (대문자)
        case 115:
          // s 키 (소문자)
          game.check(game.LdownArrows, "l_down");
          break;
        case 87: // W 키 (대문자)
        case 119:
          // w 키 (소문자)
          game.check(game.LupArrows, "l_up");
          break;
        case 68: // D 키 (대문자)
        case 100:
          // d 키 (소문자)
          game.check(game.LrightArrows, "l_right");
          break;
      }
    }
  }

  function RhandlePress(e) {
    console.log('Key pressed:', e.keyCode, e.key); // 디버깅용

    if (game.started && !game.paused) {
      switch (e.keyCode) {
        case 74: // J 키 (대문자)
        case 106:
          // j 키 (소문자)
          game.check(game.RleftArrows, "r_left");
          break;
        case 75: // K 키 (대문자)
        case 107:
          // k 키 (소문자)
          game.check(game.RdownArrows, "r_down");
          break;
        case 73: // I 키 (대문자)
        case 105:
          // i 키 (소문자)
          game.check(game.RupArrows, "r_up");
          break;
        case 76: // L 키 (대문자)
        case 108:
          // l 키 (소문자)
          game.check(game.RrightArrows, "r_right");
          break;
      }
    }
  }

  document.addEventListener("keydown", LhandlePress, false);
  document.addEventListener("keydown", RhandlePress, false);

  // 캔버스 클릭 시 YouTube 비디오 시작 (사용자 상호작용)
  var canvas = document.getElementById("canvas");
  if (canvas) {
    canvas.addEventListener("click", function () {
      if (game.youtubePlayer && game.youtubeReady) {
        try {
          var playerState = game.youtubePlayer.getPlayerState();
          if (playerState === YT.PlayerState.UNSTARTED || playerState === YT.PlayerState.PAUSED) {
            game.youtubePlayer.playVideo();
          }
        } catch (error) {
          console.log('YouTube video play attempt on click:', error);
        }
      }
    });
  }
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map