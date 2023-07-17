const notFound = (req, res, next) => {
  const error = new Error(`NOT FOUND - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
const errorHandler = (err, req, res, next) => {
  const newStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(newStatusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
