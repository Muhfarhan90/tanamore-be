const validateFileSize = (err, req, res, next) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 10000000",
      });
    } else if (err.message === "Only image files are allowed") {
      return res.status(400).json({
        status: "fail",
        message: "Only image files are allowed",
      });
    }
  }
  next();
};

module.exports = validateFileSize;
