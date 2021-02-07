import JsDos from './JsDos';
import FilePicker from './FilePicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';
import React, { useState } from 'react';


function App() {

  const [jsDosIsReady, setJsDosIsReady] = useState(false);

  return (
    <div style={{backgroundColor: "#0000aa"}}>
      <div className="jumbotron jumbotron-fluid" style={{backgroundColor: "#0000aa"}}>
        <Container>
          <Row>
            <Col xs={4}></Col>
            <Col xs={4}>
              <JsDos setJsDosIsReady={setJsDosIsReady}/>
            </Col>
            <Col xs={4}></Col>
          </Row>
        </Container>
      </div>
      <hr/>
      <Container>
        <Row>
          <Col xs={4}></Col>
          <Col xs={4}><FilePicker jsDosIsReady={jsDosIsReady}/></Col>
          <Col xs={4}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
