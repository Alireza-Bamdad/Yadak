export const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const user = req.user;  
    if (!user) return res.status(401).json({ message: 'شما وارد نشده‌اید' });  // پیام فارسی

    if (user.role === requiredRole || user.role === 'super_admin') {
      return next(); 
    } else {
      return res.status(403).json({ message: 'دسترسی ممنوع' });  // پیام فارسی
    }
  };
};
