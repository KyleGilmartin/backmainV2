import { Location } from "./locationModel";
import mongoose from 'mongoose';


function readLocations(req, res, options = []) {

    // this uses object deconstruction to extract the data from the query string
    // it is equivalent to writing
    // const title = req.query.title
    // const isbn = req.query.isbn
    // const limit = req.query.limit
    // const sum = req.query.sum

    const { name, id, limit, sum } = req.query;
    let filter = {};

    if (name) {

        filter.title = { $regex: `^${name}$`, $options: 'i' };
    }

    if (id) {

        filter.uid = id
    }

    if (sum) {
        console.log(sum);

        // the filter is for a string which contains the sum text and is case insensitive.
        // could also use the syntax          filter.summary = `/%{sum}/i`;

        filter.summary = { $regex: sum, $options: 'i' };
    }

    const limitNumber = parseInt(limit)

    Location.find(filter)
        .limit(limitNumber)
        .then((result) => {
            res.json(result)
        })
        .catch((error) =>
            res.status(500).json({ error: 'An error' + error }))


}

function readLocation(req, res) {
    const id = req.params.id;
    Location.findById(id)
        .then((result) => {
            console.log('result' + result.uri);

            res.json(result)
        })
        .catch((error) =>
            res.status(404).json({ error: 'not found' }))
}


function createLocation(req, res) {
    let bookDoc = new Location({
        uid: req.body.uid,
        lat: parseFloat(req.body.latitude),
        lon: parseFloat(req.body.longitude),
        name: req.body.location,
        description: req.body.description,
        image: req.body.image
    });
    bookDoc.save()
        .then((result) => {
            console.log('Location saved');
            // res.location(result.uri)
            //     .status(201)
            //     .json({ id: result._id, uri: result.uri })
        })
        .catch((error) => {
            console.error(error)
            // res.status(412).json({ status: 'fail', message: 'not created' + error })
        });
    console.log('Promising to save');
}

function updateLocations(req,res){
    const id = req.params.id;
    Location.findByIdAndUpdate({_id : id},{$set:{comments : req.body.comments}},{new:true}).then((result) => {
        console.log('result' + result.uri);
        res.json(result)
    })
    .catch((error) => res.status(404).json({ error: 'not found', errorobj : error }))
}

function deleteLocations(req, res) {
    const id = req.params.id;
    //console.log("id",id)
    Location.deleteOne({_id : id})
        .then((result) => {
            //console.log('result' + result);
            console.log('result',result);

            res.json(result)
        })
        .catch((error) =>
            res.status(404).json({ error: 'not found' }))
}



export default { createLocation, readLocation, readLocations , deleteLocations, updateLocations}