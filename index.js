import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });


app.get('/', async (req, res) => {
  let catFacts = [];
  let foxPicture;
  let holidays;
  await axios.get("https://catfact.ninja/facts?limit=3")
  .then(function(response){
    response.data.data.forEach(fillCatFact);
    function fillCatFact(elt, item) {
      catFacts[item] = elt.fact;
    }
  }).catch(function(error){
    catFacts = null;
    console.log(error);
  });

  await axios.get('https://randomfox.ca/floof/')
  .then(function (response) {
    foxPicture = response.data.image;
  })
  .catch(function (error) {
    foxPicture = null;
    console.log(error);
  })


  await axios.get(`https://date.nager.at/api/v2/publicholidays/2021/${req.params.countryCode ? req.params.countryCode : 'FR'}`)
  .then(function (response) {
    holidays = response.data;
  })
  .catch(function (error)  {
    holidays = null;
    console.log(error);
  })
  let data = { foxPicture: foxPicture, catFacts: catFacts, holidays: holidays };

  res.status(200).send(JSON.stringify(data));
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
