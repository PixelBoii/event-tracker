import Joi from 'joi';
import Prisma from '../../../lib/prisma';
import BuildAPI from '../../../lib/buildApi';

export default BuildAPI({
    'POST': async (req, res) => {
        const data = Joi.attempt(req.body, Joi.object({
            name: Joi.string().alphanum().min(3).max(40).required(),
            startsAt: Joi.date().iso().required(),
            endsAt: Joi.date().iso().required(),
        }));

        let event = await Prisma.calendarEvent.create({
            data
        });
    
        return res.json(event);
    },

    'DELETE': async (req, res) => {
        const { id } = Joi.attempt(req.body, Joi.object({
            id: Joi.number().required()
        }));

        await Prisma.calendarEvent.delete({
            where: {
                id
            }
        });

        return res.status(200);
    }
});