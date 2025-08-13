export const handleServerError = (res, error, message = 'خطای داخلی سرور') => {
  console.error(`[خطا]: ${message}`, error?.message || error);
  res.status(500).json({ message, error: error?.message });
};

export const handleValidationError = (res, field) => {
  return res.status(400).json({
    message: `فیلد «${field}» الزامی است`,
    code: 'VALIDATION_ERROR',
    field,
  });
};

export const handleNotFound = (res, entity = 'مورد') => {
  return res.status(404).json({
    message: `${entity} یافت نشد`,
    code: 'NOT_FOUND',
  });
};

export const handleConflict = (res, field) => {
  return res.status(409).json({
    message: `«${field}» قبلاً ثبت شده است`,
    code: 'CONFLICT_ERROR',
    field,
  });
};

export const handleUnauthorized = (res, message = 'دسترسی غیرمجاز') => {
  return res.status(401).json({
    message,
    code: 'UNAUTHORIZED'
  });
};
