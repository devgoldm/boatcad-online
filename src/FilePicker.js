import React, {useEffect, useState} from 'react';
import { saveAs } from 'file-saver';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row } from 'react-bootstrap';

const OBJ_STORE = "FILE_DATA";

function FilePicker(props) {
  
  const [db, setDb] = useState(null);
  const [fileList, setFileList] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if(props.jsDosIsReady)
    { 
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
    }
  }, [props.jsDosIsReady]);

  useEffect(() => {
    if(db)
    {
      console.log("object stores: ", db.objectStoreNames);

      if(!db.objectStoreNames.contains(OBJ_STORE))
        return;

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

          if(!name.toUpperCase().endsWith(".BOF") && 
             !name.toUpperCase().endsWith(".OFF") && 
             !name.toUpperCase().endsWith(".DXF") &&
             !name.toUpperCase().endsWith(".PLT") &&
             !name.toUpperCase().endsWith(".TXT") &&
             !name.toUpperCase().endsWith(".IGS") &&
             !name.toUpperCase().endsWith(".NNN")
            ) 
            return <tr key={idx}></tr>;

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
        <Col xs={12}>
          <h1 style={{color: "yellow", textAlign: "center"}}>
            Files&nbsp;&nbsp;<Button size="sm" onClick={() => {setRefresh(!refresh)}}>Refresh</Button>
          </h1>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col xs={12}>
          <div>
            <table>
                <tbody>
                  {fileList}
                </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FilePicker;