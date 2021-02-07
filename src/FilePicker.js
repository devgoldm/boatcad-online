import React, {useEffect, useState} from 'react';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';

const OBJ_STORE = "FILE_DATA";

function FilePicker() {
  
  const [db, setDb] = useState(null);
  const [fileList, setFileList] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let request = indexedDB.open("/boatcad");
    request.onerror = function() {
      console.log("App can't access indexedDB");
    };
    request.onsuccess = function(event) {
      let dbResult = event.target.result;
      dbResult.onerror = function(event) {
        console.error("Database error: " + event.target.errorCode);
      };

      setDb(dbResult);
    };
  }, []);

  useEffect(() => {
    if(db)
    {
      db.transaction(OBJ_STORE).objectStore(OBJ_STORE).getAllKeys().onsuccess = function(allKeysEvent) {
        const allKeys = allKeysEvent.target.result;
        console.log("Files are: ", allKeys);

        let keyList = allKeys.map((name, idx) => {
          const download = (keyName) => {
            db.transaction(OBJ_STORE).objectStore(OBJ_STORE).get(keyName).onsuccess = (fileEvent) => {
              const fileBlob = fileEvent.target.result;
              console.log(`${keyName} :`, fileBlob);

              const mimeType = "application/octet-stream";
              const dataArray = fileEvent.target.result.contents;
              const blob = new Blob([dataArray], {type: mimeType});              
              saveAs(blob, keyName.replace(/^.*[\\\/]/, ''));
            }
          }

          if(name.endsWith(".fs") || name.toUpperCase().endsWith(".EXE")) return <tr key={idx}></tr>;

          return ( 
            <tr style={{color: "white", textAlign: "center"}} key={idx}>
              <td>{name.replace(/^.*[\\\/]/, '')}&nbsp;</td>
              <td><Button size="sm" variant="success" onClick={() => {download(name)}}>Download</Button></td>
            </tr>
          )
        });
        setFileList(keyList);
      };
    }
  }, [db, refresh]);

  return (
    <Container>
      <Row>
        <Col xs={8}>
          <h3 style={{color: "yellow", textAlign: "center"}}>Files</h3><br/>
        </Col>
        <Col xs={4}>
          <Button size="sm" onClick={() => {setRefresh(!refresh)}}>Refresh</Button>
        </Col>
      </Row>
      <Row>
        <div>
          <table>
              <tbody>
                {fileList}
              </tbody>
          </table>
        </div>
      </Row>
    </Container>
  );
}

export default FilePicker;