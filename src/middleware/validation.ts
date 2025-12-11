import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

interface ValidationSchema {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body, query, params } = req;
    const errors: string[] = [];

    // 验证请求体
    if (schema.body) {
      const { error } = schema.body.validate(body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    // 验证查询参数
    if (schema.query) {
      const { error } = schema.query.validate(query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    // 验证路径参数
    if (schema.params) {
      const { error } = schema.params.validate(params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => detail.message));
      }
    }

    // 如果有错误，返回400响应
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors,
      });
    }

    next();
  };
};