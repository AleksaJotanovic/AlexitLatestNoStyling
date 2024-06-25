import Offer from "../models/Offer.js";
import { v4 as uuid } from 'uuid';
import { CreateSuccess } from "../middlewares/success.js";
import { CreateError } from "../middlewares/error.js";


export const getAllOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({});
        return next(CreateSuccess(200, 'All offer fetched succesfully.', offers));
    } catch (error) {
        console.log('Error catched on fetching all offers: ', error);
    }
};

export const getOfferById = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            return next(CreateSuccess(200, 'Single offer fetched succesfully.', offer));
        } else {
            return next(CreateError(400, 'Offer not found.'));
        }
    } catch (error) {
        console.log('Error catched on fetching single offer: ', error);
    }
};

export const createOffer = async (req, res, next) => {
    try {
        if (req.body) {
            const newOffer = new Offer({ ...req.body, _id: uuid() });
            await newOffer.save();
            return res.send();
        } else {
            return res.status(400).send('Creating offer: you must apply a body in request.');
        }
    } catch (error) {
        console.log('Error catched on posting offer: ', error);
    }
};

export const updateOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await Offer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).send();
        } else {
            return res.status(400).send('Offer for update not found.');
        }
    } catch (error) {
        console.log('Error catched on updating offer: ', error);
    }
};

export const deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await Offer.findByIdAndDelete(req.params.id);
            return res.status(200).send();
        } else {
            return res.status(400).send('Deleting offer: offer not found.');
        }
    } catch (error) {
        console.log('Error catched on deleting offer: ', error);
    }
};