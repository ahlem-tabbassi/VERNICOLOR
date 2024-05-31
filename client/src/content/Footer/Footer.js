import React from 'react';
import { Container, Row, Col, Card } from "reactstrap";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-body-tertiary text-muted ">
      <Container fluid>
        <Row>
          <Col xl="12">
            <Card className="shadow" style={{ marginLeft: "210px",marginRight: "-30px"}}>
          
              <section>
                <div className="container text-center text-md-start mt-1"> 
                  <div className="row mt-2"> 
                    <div className="col-md-3 col-lg-4 col-xl-6 mx-auto mb-1">
                      <h6 className="text-uppercase fw-bold mb-1"> 
                        <i className="fas fa-gem me-2"></i>  Vernicolor Group Tunisia
                      </h6>
                      <p className="small"> 
                        VERNICOLOR Group, headquartered in France, is a leading provider of decorated sub-assemblies in Europe and North America, specializing in UV varnishes. They offer innovative solutions for industries like automotive, with services including design, molding, painting, and assembly using high-quality materials like wood, leather, and carbon synthetics.
                      </p>
                    </div>
                    <div className="col-md-4 col-lg-3 col-xl-6 mx-auto mb-md-0 mb-1">
                      <h6 className="text-uppercase fw-bold mb-1"> 
                        Contact
                      </h6>
                      <p className="small"> 
                        <i className="fas fa-home me-2"></i> RUE DES MATHEMATIQUES, Z.I. - 8030 - GROMBALIA
                      </p>
                      <p className="small"> 
                        <i className="fas fa-envelope me-2"></i> Vernicolorgroup@outlook.com
                      </p>
                      <p className="small"> 
                        <i className="fas fa-phone me-2"></i> + 216 72 212 140
                      </p>
                      <p className="small"> 
                        <i className="fab fa-linkedin"></i>
                        <a className="text-reset fw-bold ms-1" href="https://www.linkedin.com/company/vernicolor-group/mycompany/verification/"> Linkedin</a> {/* Reduced margin and added ms-1 */}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="text-center p-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}> 
                <small>
                  © 2024 Copyright:
                  <a className="text-reset fw-bold" href="https://www.vernicolor.com"> VERNICOLOR GROUP</a>
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;