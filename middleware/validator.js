const Joi = require('joi');

exports.validate = (type) => (req, res, next) => {
    const schema = getSchema(type);
    if(schema) {
        const result = schema.validate(req.body);
        if (result.error) {
            const { details } = result.error;
            const message = details[0].message.replace(/"|'/g, '');
            req.flash('danger', message)
            return res.redirect('/'); 
        }
    }
    next();
}

const getSchema = (type) => {
    switch (type) {
        case 'payment': {
            return Joi.object().keys({
                    fullName: Joi.string().required(),
                    cardNumber: Joi.string().required(), 
                    month: Joi.string().required(),
                    year: Joi.string().required(),
                    cvv: Joi.string().required()
                })
        } 
        default: {
            return null;
        }
    }
} 