import mongoose from 'mongoose';
import { defaultCipherList } from 'node:constants';
const Schema = mongoose.Schema;

const ContactSchema = new Schema
    ({
        FullName: String,
        EmailAddress: String,
        ContactNumber: String
    },
        {
            collection: "contacts"
        });

const Model = mongoose.model("Contact", ContactSchema);
export default Model;
