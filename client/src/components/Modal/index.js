import React from "react"
import { Container, Modal } from "mdbreact"
import IosClose from "react-ionicons/lib/IosClose"

const ModalForm = ({ isActive, closeModal, title, children }) => (
  <Container>
    <Modal isOpen={isActive} toggle={closeModal}>
      <div className="card-body">
        <div className="flex">
          <h3>{title}</h3>
          <IosClose onClick={closeModal} fontSize="30px" color="#007bff" />
        </div>
      </div>
      {children}
    </Modal>
  </Container>
)

export default ModalForm
