import axios from "axios";


export const getTopHeader = async () => {
   try{
    const response= await axios({
        headers: {
          Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImRhdGEiOnsidXNlcm5hbWUiOiJhdG9tbGF1bmNoIiwiZW1haWwiOiJlcmljQGxpbDJnb29kLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTI0IDA3OjU5OjQzIiwidXBkYXRlZF9hdCI6IjIwMjEtMDgtMjQgMDc6NTk6NDMiLCJpZCI6MX0sImlhdCI6MTYyOTgxNzE4M30.4H1VCotSIHHBg2yImuv3DDXDTQkZatkvp2r0rChL1es",
        },
        method: "GET",
        url: 'https://api.loop.markets/v1/menu',
      });
      return response;
   }
   catch(err){
        return err;
   }
  };