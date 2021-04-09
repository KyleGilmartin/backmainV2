const { fdb, admin } = require('./config/firebase-admin');

let addPost = async ()=> {
    // const postRef = fdb.collection('posts').doc();
    // let postId = postRef.id;
    // let response = await postRef.set({
    //     name: "Ali",
    //     coordinates: new admin.firestore.GeoPoint(35.9854,74.45454),
    //     location: "Test",
    //     id: postId
    // })
    // console.log(response.id)
    let post = await fdb.collection('posts').doc("7KYl81JLlbLsmgLdmw3F").get();
    if(post.exists) {
        console.log(post.get('coordinates').latitude)
    }
}

addPost()