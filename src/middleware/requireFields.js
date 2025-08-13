export const requireFields = (...fields) => (req, res, next) => {
  for (let field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `فیلد «${field}» الزامی است`,
        code: 'VALIDATION_ERROR',
        field,
      });
    }
  }
  next();
};

