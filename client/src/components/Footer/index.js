import React from "react"
import { MDBFooter } from "mdbreact"

const Footer = () => (
  <MDBFooter color="blue" className="text-center font-small darken-2">
    <p className="footer-copyright mb-0 py-3 text-center">
      Rehmora Inc. {new Date().getFullYear()}
    </p>
  </MDBFooter>
)

export default Footer
