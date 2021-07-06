import Joi from 'joi'
import Prisma from '../../../lib/prisma'
import BuildAPI from '../../../lib/buildApi'

export default BuildAPI({
    'POST': async (req, res) => {
        const data = Joi.attempt(req.body, Joi.object({
            name: Joi.string().pattern(/^[a-zA-Z0-9_\s]*$/).min(3).max(40).required(),
            currency: Joi.string().pattern(/^[a-zA-Z0-9_\s]*$/).min(3).max(40).required(),
            amount: Joi.number().positive().required(),
        }));

        let invoice = await Prisma.invoice.create({
            data
        });
    
        return res.json(invoice);
    },
});