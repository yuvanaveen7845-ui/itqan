import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
  };
};

export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  product: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    original_price: Joi.number().positive().allow(null, 0),
    discount: Joi.number().min(0).max(100).allow(null, 0),
    image_url: Joi.string().allow(null, ''),
    images: Joi.array().items(Joi.string()).allow(null),
    fabric_type: Joi.string().required(),
    color: Joi.string().allow(null, ''),
    stock: Joi.number().integer().min(0).required(),
  }),
  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().positive().required(),
      })
    ).required(),
    address_id: Joi.string().required(),
  }),
};
