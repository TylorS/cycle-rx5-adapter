(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var rxjs_1 = typeof window !== "undefined" ? window['Rx'] : typeof global !== "undefined" ? global['Rx'] : null;
function logToConsoleError(err) {
    var target = err.stack || err;
    if (console && console.error) {
        console.error(target);
    } else if (console && console.log) {
        console.log(target);
    }
}
function attemptSubjectComplete(subject) {
    try {
        subject.complete();
    } catch (err) {
        return void 0;
    }
}
var RxJSAdapter = {
    adapt: function adapt(originStream, originStreamSubscribe) {
        if (this.isValidStream(originStream)) {
            return originStream;
        }
        return rxjs_1.Observable.create(function (observer) {
            var dispose = originStreamSubscribe(originStream, observer);
            return function () {
                if (typeof dispose === 'function') {
                    dispose.call(null);
                }
            };
        });
    },
    dispose: function dispose(sinks, sinkProxies, sources) {
        Object.keys(sources).forEach(function (k) {
            if (typeof sources[k].unsubscribe === 'function') {
                sources[k].unsubscribe();
            }
        });
        Object.keys(sinkProxies).forEach(function (k) {
            attemptSubjectComplete(sinkProxies[k].observer);
        });
    },
    makeHoldSubject: function makeHoldSubject() {
        var stream = new rxjs_1.ReplaySubject(1);
        var observer = {
            next: function next(x) {
                stream.next(x);
            },
            error: function error(err) {
                logToConsoleError(err);
                stream.error(err);
            },
            complete: function complete(x) {
                stream.complete();
            }
        };
        return { stream: stream, observer: observer };
    },
    isValidStream: function isValidStream(stream) {
        return typeof stream.subscribe === 'function' && typeof stream.onValue !== 'function';
    },
    streamSubscribe: function streamSubscribe(stream, observer) {
        var subscription = stream.subscribe(observer);
        return function () {
            subscription.unsubscribe();
        };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxJSAdapter;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
