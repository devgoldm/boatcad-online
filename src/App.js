import JsDos from './JsDos';
import FilePicker from './FilePicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  return (
    <div style={{backgroundColor: "#0000aa"}}>
      <div class="jumbotron jumbotron-fluid" style={{backgroundColor: "#0000aa"}}>
        <Container>
          <Row>
            <Col xs={4}></Col>
            <Col xs={4}>
              <JsDos/>
            </Col>
            <Col xs={4}></Col>
          </Row>
        </Container>
      </div>
      <hr/>
      <Container>
        <Row>
          <Col xs={4}></Col>
          <Col xs={4}><FilePicker/></Col>
          <Col xs={4}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
