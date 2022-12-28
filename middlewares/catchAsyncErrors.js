module.exports = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

// We wrap our async requests in this function and it catches all the errors associated with bad requests
