const _instances = {};

module.exports = {
  get: (ClassConstructor, id) => {
    let name = ClassConstructor.name;
    if (!_instances[name] || !_instances[name][id]) {
      _instances[name] = _instances[name] || {};
      _instances[name][id] = new ClassConstructor(id); 
    }
    return _instances[name][id];
  }
};

