import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";


const ProgressLoading = () => {
    const color = '#FFFFFF'
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
    `

  return (
      <ClipLoader
          color={color}
          loading={true}
          css={override}
          size={50}
      />
      )
}

export default ProgressLoading
