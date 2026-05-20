import http from 'http';

http.get('http://localhost:5000/api/gigs', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.gigs && parsed.gigs.length > 0) {
        const id = parsed.gigs[0]._id;
        console.log('Fetching gig id:', id);
        http.get(`http://localhost:5000/api/gigs/${id}`, (res2) => {
          let data2 = '';
          res2.on('data', (chunk) => data2 += chunk);
          res2.on('end', () => console.log('Response:', res2.statusCode, data2));
        });
      } else {
        console.log('No gigs found');
      }
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (e) => console.error(e));
