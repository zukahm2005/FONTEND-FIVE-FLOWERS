import axios from 'axios';

const trackVisit = (page) => {
  const visitTime = new Date().toISOString();
  const token = localStorage.getItem('token');

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  axios.post('http://localhost:8080/api/analytics/track', {
    visitTime,
    page,
  }, {
    headers: headers,
  })
  .then(response => {
    console.log('Visit tracked successfully');
  })
  .catch(error => {
    console.error('Error tracking visit', error);
  });
};

export default trackVisit;
