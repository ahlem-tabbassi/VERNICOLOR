import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Col,
  InputGroup,
  Input,
  Table,
  Container,
  Row,
  Button,
  Modal, 
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import SupplierDetails from "./SupplierDetails";
import Footer from "../../content/Footer/Footer";

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); 
  const [supplierToDelete, setSupplierToDelete] = useState(null); 

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authentication token missing');
        return;
      }
  
      const response = await axios.get("http://localhost:8000/api/suppliers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuppliers(response.data);
      setFilteredSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setLoading(false);
    }
  };
  
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchQuery(searchTerm);
    const filtered = suppliers.filter((supplier) =>
      supplier.groupName.toLowerCase().includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
  };
  
  
  const toggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };

  const handleDetailsClick = (supplier) => {
    setSelectedSupplier(supplier);
    toggleDetailsModal();
  };

  const updateSupplierInList = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier._id === updatedSupplier._id ? updatedSupplier : supplier
      )
    );
    setFilteredSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier._id === updatedSupplier._id ? updatedSupplier : supplier
      )
    );
  };

  const toggleDeleteConfirmation = () => setDeleteConfirmationOpen(!deleteConfirmationOpen);

  const handleDeleteConfirmation = (supplier) => {
    setSupplierToDelete(supplier);
    toggleDeleteConfirmation();
  };

  const deleteSupplierById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:8000/api/suppliers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchSuppliers();
        toggleDeleteConfirmation(); 
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };
  

  return (
    <div style={{ backgroundColor: "#FFFAFA", minHeight: "86vh" }}>
  <Container fluid>
      <Row>
        <Col xl="12">
          <Card className="shadow mt-7" style={{ marginLeft: "250px"}}>
            <CardHeader className="d-flex justify-content-between align-items-center border-0" style={{ boxShadow:"0px 5px 4px rgba(0, 0, 0, 0.5)"}}>
              <h3 className="mb-0">Suppliers List</h3>
              <InputGroup style={{ maxWidth: "300px" }}>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="mr-2"
                  style={{
                    fontSize: "0.875rem",
                    height: "calc(1.5em + .75rem + 2px)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                  }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </CardHeader>
            <div style={{ overflowY: "auto", maxHeight: "400px",boxShadow:"0px 5px 4px rgba(0, 0, 0, 0.3)" }}>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                <th scope="col" style={{ fontWeight: "bold" }}>Logo</th>
    <th scope="col" style={{ fontWeight: "bold" }}>Group Name</th>
    <th scope="col" style={{ fontWeight: "bold" }}>Address</th>
    <th scope="col" style={{ fontWeight: "bold" }}>Code TVA</th>
    <th scope="col" style={{ fontWeight: "bold" }}>Code DUNS</th>
    <th scope="col" style={{ fontWeight: "bold" }}>Details</th>
    <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={supplier.image}
                          alt={`${supplier.groupName} `}
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>{supplier.groupName}</td>
                      <td>{supplier.address}</td>
                      <td>{supplier.codeTVA}</td>
                      <td>{supplier.codeDUNS}</td>
                      <td>
                        <Button
                          onClick={() => handleDetailsClick(supplier)}
                          outline
                          color="primary"
                          style={{
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.8rem",
                            marginLeft: "0.7rem",
                          }}
                        >
                          <i className="fa fa-info" aria-hidden="true"></i>
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => handleDeleteConfirmation(supplier)} 
                          outline
                          color="danger"
                          style={{
                            padding: "0.2rem 0.4rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          <i className="fa fa-trash " aria-hidden="true"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
       
            </div>
          
          </Card>
  
        </Col>
      </Row>
  <Row  className="mt-6"></Row>
      <Row className="mt-9"> <Col> <Footer/></Col> </Row>
      <SupplierDetails
        isOpen={isDetailsModalOpen}
        toggle={toggleDetailsModal}
        supplier={selectedSupplier}
        supplierId={selectedSupplier ? selectedSupplier._id : null}
        updateSupplierInList={updateSupplierInList} 
      />

    
      <Modal isOpen={deleteConfirmationOpen} toggle={toggleDeleteConfirmation}>
        <ModalHeader toggle={toggleDeleteConfirmation}>Delete Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the supplier {supplierToDelete && supplierToDelete.groupName}?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => deleteSupplierById(supplierToDelete._id)}>
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={toggleDeleteConfirmation}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
 
    </div>
  );
};

export default Suppliers;