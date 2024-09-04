

Radar.forwardGeocode({ query: '841 broadway, new york, ny' })
  .then((result) => {
    const { addresses } = result;
    // do something with addresses
  })
  .catch((err) => {
    // handle error
  });
  console.log(addresses);






