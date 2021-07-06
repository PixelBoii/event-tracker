import Joi from 'joi'
import Prisma from '../../../../lib/prisma';
import BuildAPI from '../../../../lib/buildApi';

export default BuildAPI({
    'POST': async (req, res) => {
        const { status } = Joi.attempt(req.body, Joi.object({
            status: Joi.string().pattern(/^[a-zA-Z0-9_\s]*$/).min(3).max(40).required(),
        }));

        const { id } = req.query;

        let invoice = await Prisma.invoice.update({
            where: {
                id: Number(id)
            },
            data: {
                status
            }
        });
    
        return res.json(invoice);
    },
});