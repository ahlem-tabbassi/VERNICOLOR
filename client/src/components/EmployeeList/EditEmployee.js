import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";

const EditEmployee=({ isOpen, toggle, employee, employeeId, updateEmployeeInList }) =>{
  const [showSuccess, setShowSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [editedFormData, setEditedFormData] = useState({
    firstName: "", 
    lastName: "", 
    position: "" ,
    phone: "",
  });

  
  useEffect(() => {
    if (employee) {
      setEditedFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        position: employee.position || "" ,
        phone: employee.phone || "" ,
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFormData({
      ...editedFormData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (!editedFormData.firstName || !editedFormData.lastName || !editedFormData.position || !editedFormData.phone) {
        setShowError(true);
        return;
      }
      const token = localStorage.getItem("token");
  
      const response = await axios.put(
        `http://localhost:8000/api/employees/${employeeId}`,
        JSON.stringify(editedFormData), 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const updatedEmployee = response.data.employee; 
    console.log("Updated employee data:", updatedEmployee);
    updateEmployeeInList(updatedEmployee);
    toggle();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  } catch (error) {
    console.error("Error saving changes:", error);
  }
};
  
  if (!employee) return null;
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit employee</ModalHeader>
      <ModalBody>
        {showSuccess && (
          <Alert color="success" className="mb-3">
            Employee updated successfully!
          </Alert>
        )}
         {showError && ( 
          <Alert color="danger" className="mb-3">
            All fields are required. Please fill in all fields.
          </Alert>
        )}
        <Row>
          <Col md="6">
            <FormGroup>
              <Label for="FirstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={editedFormData.firstName || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="LastName">Last Name</Label>
              <Input
                type="text"
                name="lastName" 
                value={editedFormData.lastName || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <Label for="Position">Position</Label>
              <Input
                type="text"
                name="position"
                value={editedFormData.position || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label for="Phone">Phone</Label>
              <Input
                type="text"
                name="phone"
                value={editedFormData.phone || ""}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default EditEmployee;
