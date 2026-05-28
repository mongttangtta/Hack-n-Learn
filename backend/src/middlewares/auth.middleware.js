import Joi from "joi";
import router from "../routes/index.js";

const registerSchema = Joi.object({
        id : Joi.string().alphanum().min(3).max(30).required(),
        nickname : Joi.string().min(2).max(30).required(),
        password : Joi.string().min(6).max(128).required(),
        email: Joi.string().email().required(),
});

const nicknameQuerySchema = Joi.object({
        nickname: Joi.string()
        .pattern(/^[a-zA-Z0-9가-힣._-]{2,30}$/)
        .required()
});

export const validateNicknameQuery = (req, res, next) => {
  const { error } = nicknameQuerySchema.validate(req.body, { abortEarly: true});
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.body.nickname = String(req.body.nickname).trim();
  next();
};

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

export const requireLogin = (req, res, next) => {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access forbidden: Admins only" });
  }
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || '서버 내부 오류 발생' });
};


export const sessionTimeout = (req, res, next) => {
  if(req.session){
    if(!req.session.lastAccess){
      req.session.lastAccess = Date.now();
    } else if(Date.now() - req.session.lastAccess > 30 * 60 * 1000) {
      req.session.destroy(() => {
        return res.status(440).json({ message: "Session expired" });
      });
      return;
    } else {
      req.session.lastAccess = Date.now();
    }
  }
  next();
};

export default requireLogin;
