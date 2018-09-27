module.exports = function setInObject(obj, keyPath, val) {
  for(let i=0; i<keyPath.length-1; i++) {
    obj = obj[keyPath[i]];
  }
  obj[keyPath[keyPath.length-1]] = val;
}

