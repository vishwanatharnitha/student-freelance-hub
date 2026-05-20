import axios from 'axios';

axios.get('http://localhost:5000/api/gigs')
  .then(res => {
    const id = res.data.gigs[0]._id;
    console.log('Fetching gig id:', id);
    
    // Test direct axios
    axios.get(`http://localhost:5000/api/gigs/${id}`)
      .then(res2 => console.log('Direct axios success:', res2.status))
      .catch(err => console.error('Direct axios error:', err.message));
      
  })
  .catch(err => console.error(err.message));
