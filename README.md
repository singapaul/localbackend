1. npm install
2. npm run dev

<img width="682" alt="example" src="https://user-images.githubusercontent.com/89204135/209936111-129c43f1-58c6-421e-99fe-789deb91685b.png">

You need to add a config.env file into the config folder. And attach the following keys:

PORT=3000
NODE_ENV=development
DB_LOCAL_URI = mongodb://127.0.0.1/places
DB_URI= your online mongo db url
GEOCODER_PROVIDER = mapquest
GEOCODER_API_KEY =
