import express from 'express';
import { createOffer, deleteOffer, getAllOffers, getOfferById, updateOffer } from '../controllers/offer.controller.js';


const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/create', createOffer);
router.put('/update/:id', updateOffer);
router.delete('/delete/:id', deleteOffer);


export default router;