import React, { useRef, useEffect, useState } from "react";
import zipFile from "./BL3D.zip";
import keycode from 'keycode';
require("js-dos");
const Dos = window.Dos;


const JsDos = (props) => {
    const ref = useRef(null);
    const [windowCi, setWindowCi] = useState(null);
    const [text, setText] = useState("Waiting for keyboard input...");

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current, {
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
                autolock: false,
            }).then((runtime) => {
                return runtime.fs.extract(zipFile, "/boatcad").then(() => {
                    return runtime.main(["-c", "cd boatcad", "-c", "BL3D.EXE"]);
                }).then(ci => {
                  setWindowCi(ci); 
                  props.setJsDosIsReady(true);
                  return ci;
                });
            });

            return () => {
                ciPromise.then(ci => {
                  ci.exit();
                });
            };
        }
    }, [ref]);

    useEffect(() => {
      document.addEventListener("keydown", (event) => {
        if(event.repeat)
          return;

        const debugCode = keycode(keycode(event));
        setText(`*KeyboardEvent* : key='${event.key}' | code='${event.code}' | keyCode='${debugCode}'`);
        pressKey(keycode(event))});
    }, []);

    const pressKey = (code) => {
      const newCode = keycode(code);
      if(newCode === 13)
        return;

      windowCi?.simulateKeyEvent(newCode, true);
      windowCi?.simulateKeyEvent(newCode, false);
      console.log("Key code pressed = ", newCode);
    };

    return (
    <div className="canvasParent">
      {/* <p style={{color: "white"}}>{text}</p> */}
      <canvas className="dosCanvas" ref={ref}/>
    </div> 
    );
}

export default JsDos;