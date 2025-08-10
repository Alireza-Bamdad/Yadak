

export const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const user = req.user;  

    if (user.role === requiredRole || user.role === 'super_admin') {
      return next(); 
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};

