
// Necessary data for Clarifai API
const returnClarifaiRequestOptions = (imageUrl) => {
    // PAT (Personal Access Token) can be found in clarifai.com (Authentification)
    const PAT = '4fc069d4cdc0412c8ba6ac50310a529e';
    // my clarifai user & my clarifai App
    const USER_ID = 'rsg';
    const APP_ID = 'using-face-detection';
    // Change these to whatever model and image URL you want to use
    //const MODEL_ID = 'face-detection';
    //const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions
}

const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", returnClarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(result => res.send(result))
    .catch(error => res.status(400).json('Error: unable to work with API'))
}

const handleImage = (req, res, knex) => {
    const { id } = req.body;
    knex('users').where({id})
        .increment('entries', 1)
        .returning('*')
        .then(data => {
            res.json(data[0]);
        })
        .catch (() => res.status(400).json('Error, unable to get entries'));
};

module.exports = {
    handleImage, handleApiCall
};