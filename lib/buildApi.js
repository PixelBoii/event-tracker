import Joi from 'joi'

export default function BuildAPI(methods) {
    return async (req, res) => {
        if (Object.keys(methods).includes(req.method)) {
            try {
                return await methods[req.method](req, res);
            } catch (e) {
                if (e instanceof Joi.ValidationError) {
                    return res.status(400).json({
                        'errors': e.details.map(e => e.message)
                    });
                } else {
                    throw e;
                }
            }
        } else {
            return res.status(405).json({
                'message': 'Method not allowed'
            });
        }
    }
}