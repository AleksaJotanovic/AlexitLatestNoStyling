import { CreateSuccess } from "../middlewares/success.js";
import Offercategory from "../models/Offercategory.js";
import { v4 as uuid } from 'uuid';


export const getAllOfferCategories = async (req, res, next) => {
    try {
        const offerCategories = await Offercategory.find({});
        return next(CreateSuccess(200, 'Offercategories fetched successfully.', offerCategories));
    } catch (error) {
        console.log('Error catched on fetching all offer categories: ', error);
    }
};


export const addOfferCategory = async (req, res, next) => {
    try {
        if (req.body) {
            const newOfferCategory = new Offercategory({ ...req.body, _id: uuid() });
            await newOfferCategory.save();
            return res.send();
        } else {
            return res.status(400).send("Body not applied for posting new offer category.");
        }
    } catch (error) {
        console.log('Error catched on adding new offer category: ', error);
    }
};


export const deleteOfferCategory = async (req, res, next) => {
    try {
        const offerCategory = await Offercategory.findById(req.params.id);
        if (offerCategory) {
            await Offercategory.findByIdAndDelete(req.params.id);
            return res.send();
        } else {
            return res.status(400).send('Offer category for delete not found');
        }
    } catch (error) {
        console.log('Error catched on deleting offer category: ', error);
    }
};