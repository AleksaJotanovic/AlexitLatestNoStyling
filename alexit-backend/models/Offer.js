import mongoose from 'mongoose';



const ContentSchema = mongoose.Schema({ key: { type: String, required: true }, value: [String] }, { _id: false });

const OfferSchema = mongoose.Schema({
    _id: { type: String, required: true },
    category_id: { type: String, required: true },
    title: { type: String, required: true },
    featuredImage: { type: String, required: true },
    content: [ContentSchema],
    products: [String],
    discountImpact: { state: { type: Boolean, required: true }, rate: { type: Number, required: true } },
    expiration: { type: String, required: true },
    published: { type: Boolean, required: true },
}, { versionKey: false })



export default mongoose.model("Offer", OfferSchema);