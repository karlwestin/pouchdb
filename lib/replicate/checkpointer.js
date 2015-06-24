'use strict';

var Promise = require('./../deps/promise');
var explain404 = require('./../deps/explain404');
var pouchCollate = require('pouchdb-collate');
var collate = pouchCollate.collate;

function updateCheckpoint(db, id, checkpoint, returnValue) {
  return db.get(id).catch(function (err) {
    if (err.status === 404) {
      if (db.type() === 'http') {
        explain404('PouchDB is just checking if a remote checkpoint exists.');
      }
      return {_id: id};
    }
    throw err;
  }).then(function (doc) {
    if (returnValue.cancelled) {
      return;
    }
    doc.last_seq = checkpoint;
    return db.put(doc).catch(function (err) {
      if (err.status === 409) {
        // retry; someone is trying to write a checkpoint simultaneously
        return updateCheckpoint(db, id, checkpoint, returnValue);
      }
      throw err;
    });
  });
}

function Checkpointer(src, target, id, returnValue) {
  this.src = src;
  this.target = target;
  this.id = id;
  this.returnValue = returnValue;
}

Checkpointer.prototype.writeCheckpoint = function (checkpoint) {
  var self = this;
  return this.updateTarget(checkpoint).then(function () {
    return self.updateSource(checkpoint)
      .catch(function(err) {
        // At this point, target and source are out of sync
        // Roll back the target to the previous checkpoint,
        return Promise.reject('OUT_OF_SYNC');
      });
  });
};

Checkpointer.prototype.updateTarget = function (checkpoint) {
  return updateCheckpoint(this.target, this.id, checkpoint, this.returnValue);
};


var threshold = 5;

Checkpointer.prototype.updateSource = function (checkpoint) {
  var self = this;
  if (this.readOnlySource) {
    return Promise.resolve(true);
  }

  return new Promise(function(resolve, reject) {
    function send(retry) {
      return updateCheckpoint(self.src, self.id, checkpoint, self.returnValue)
        .then(function(res) {
          resolve(res);
        })
        .catch(function (err) {
          var isForbidden = typeof err.status === 'number' &&
            Math.floor(err.status / 100) === 4;
          if (isForbidden) {
            self.readOnlySource = true;
            resolve(true);
          }

          var offline = err.status === 0 || typeof err.status !== 'number';
          if(offline && ++retry < threshold) {
            return send(retry);
          }
          reject(err);
        });
    }

    send(0);
  });
};

Checkpointer.prototype.getCheckpoint = function () {
  var self = this;
  return self.target.get(self.id).then(function (targetDoc) {
    return self.src.get(self.id).then(function (sourceDoc) {
      if (collate(targetDoc.last_seq, sourceDoc.last_seq) === 0) {
        return sourceDoc.last_seq;
      }
      return 0;
    }, function (err) {
      if (err.status === 404 && targetDoc.last_seq) {
        return self.src.put({
          _id: self.id,
          last_seq: 0
        }).then(function () {
          return 0;
        }, function (err) {
          if (err.status === 401) {
            self.readOnlySource = true;
            return targetDoc.last_seq;
          }
          return 0;
        });
      }
      throw err;
    });
  }).catch(function (err) {
    if (err.status !== 404) {
      throw err;
    }
    return 0;
  });
};

module.exports = Checkpointer;
