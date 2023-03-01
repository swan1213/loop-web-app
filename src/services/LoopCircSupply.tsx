import axios from "axios";

export const LoopCircSupply = async () => {
   const res= await axios({
        headers: {
        },
        method: "GET",
        url: `https://loop-api.loop.markets/v1/contracts/circulating-supply`,
      });

    return res;
}