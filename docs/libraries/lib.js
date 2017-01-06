'use strict';

function Library() {
  this.sq = x => x * x;
  this.average = arr => arr.reduce((a, b) => a + b) / arr.length;
  this.std_dev = arr => Math.sqrt(this.average(arr.map(e => this.sq(this.average(arr) - e))));
  this.range = function (start, end, step) {
    let arr = [],
      st = start || 0,
      ed = end || 0xffff,
      sp = step || 1;
    while (st < ed) {
      arr.push(st);
      st = st + sp;
    }
    return arr;
  };
  this.pipe = function () {
    if (arguments[1]) {
      let args = this.toArray(arguments);
      return this.pipe.apply(this, [args[1][0].apply(this, [args[0]].concat(args[1].slice(1)))].concat(args.slice(2)));
    } else {
      return arguments[0];
    }
  };
  this.time = function (rep_times, f, _that, _args) {
    let stat = new Array(rep_times),
      results = new Array(rep_times),
      c = rep_times - 1,
      st, et, avg, sdv,
      that = _that || this,
      args = _args || [];

    try {
      while (-1 < c) {
        st = new Date();
        results[c] = f.apply(that, args);
        et = new Date();
        stat[c] = (et - st) | 0;
        c = (c - 1) | 0;
      }

      avg = this.average(stat);
      sdv = this.std_dev(stat);
      console.log("executed function for " + rep_times.toString(10) + " times.");
      console.groupCollapsed("STATISTICS");
      console.log("average: " + avg.toString(10) + " [ms]");
      console.log("standard deviation: " + sdv.toString(10) + " [ms]");
      console.log(results);
      console.groupEnd();
    } catch (e) {
      console.error("ERROR: " + e.message);
    }

    return null;
  };
  this.toArray = function (obj) {
    switch (this.type(obj)) {
    case 'Array':
      return obj;
    case 'Arguments':
      return Array.prototype.slice.call(obj);
    case 'Object':
      return Object.keys(obj).map(e => [e, obj[e]]);
    case 'String':
      return obj.split('');
    default:
      return Array.prototype.slice.call(arguments);
    }
  };
  this.type = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  };
}
