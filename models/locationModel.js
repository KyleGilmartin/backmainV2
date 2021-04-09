import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';



const Schema = mongoose.Schema;


const LocationSchema = new Schema({
        name: { type: String, required: true },
        lon: { type: Number, required: true },
        lat: { type: Number, required: true },
        uid: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true},
        comments: [{Comment : String,Name : String}]
        
    }, { toJSON: { virtuals: true } }) // include virtuals when document is converted to JSON


// this creates a get property uri which can be used but does not
// get stpred om the database

LocationSchema.virtual('uri').get(function() {
    return `/Locations/${this._id}`;
});

// LocationSchema.plugin(uniqueValidator);

let Location = mongoose.model('Location', LocationSchema);


export { Location };