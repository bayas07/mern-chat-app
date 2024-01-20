const notFound = (req, res, next) => {
  const error = new Error("Page Not Found");
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);
  res.json({ message: err.message, stack: err.stack });
  next();
};

module.exports = { notFound, errorHandler };
