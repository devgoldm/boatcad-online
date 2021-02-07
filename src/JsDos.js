import React, { useRef, useEffect, useState } from "react";
import Keyboard from 'react-simple-keyboard';
import zipFile from "./BL3D.zip";
import keycode from 'keycode';
import 'react-simple-keyboard/build/css/index.css';
require("js-dos");
const Dos = window.Dos;
const DosController = window.DosController;


const JsDos = () => {
    const ref = useRef(null);
    const [windowCi, setWindowCi] = useState(null);
    const [text, setText] = useState("Waiting for keyboard input...");

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current, {
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
                cycles: 1000,
                autolock: false,
            }).then((runtime) => {
                return runtime.fs.extract(zipFile).then(() => {
                    return runtime.main(["-c", "BL3D.EXE"]);
                }).then(ci => {
                  setWindowCi(ci); 
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
      document.addEventListener("keydown", (event) => {setText(`KeyboardEvent: key='${event.key}' | code='${event.code}'`); pressKey(event.code)});
    }, []);

    const pressKey = (code) => {
      windowCi?.simulateKeyEvent(code, true);
      windowCi?.simulateKeyEvent(code, false);
      console.log("Key code pressed = ", code);
    };

    return (
    <div>
      <p style={{color: "white"}}>{text}</p>
      <canvas ref={ref} />
    </div> 
    );
}

export default JsDos;