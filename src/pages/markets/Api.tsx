import axios from 'axios';

export async function fetchTokenData() {
  const result = await axios
    .get(`https://api.loop.markets/v1/tokens`,
    { headers: { Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsidXNlcm5hbWUiOiJhdG9tbGF1bmNoIiwiZW1haWwiOiJlcmljQGxpbDJnb29kLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTI0IDA3OjU5OjQzIiwidXBkYXRlZF9hdCI6IjIwMjEtMDgtMjQgMDc6NTk6NDMiLCJpZCI6MX0sImlhdCI6MTYyOTgxNzE4M30.4H1VCotSIHHBg2yImuv3DDXDTQkZatkvp2r0rChL1es' } })
    .catch();
  return result.data;
}


export async function getAllPromosData() {
  const result = await axios.get(
    'https://old.trybe.one/wp-json/wp/v2/pages/1040380'
  ).catch();
  return  result.data?.acf.featured_articles;
}

// export function getPostsCall({ payload }) {
//   const { token } = payload;
//   const { page, queryParams } = payload.params;
//   return axios
//     .post(
//       'https://old.trybe.one/wp-json/api/v2/post/feed',
//       {
//         page, queryParams, token
//       },
//     )
//     .catch(catchAxiosError);
// }
