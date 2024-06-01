import React from 'react';
import { Container, Row, Col, Card } from "reactstrap";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-body-tertiary text-muted ">
      <Container fluid>
        <Row>
          <Col xl="12">
            <Card className="shadow" style={{ marginLeft: "210px",marginRight: "-30px"}}>
          
  
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