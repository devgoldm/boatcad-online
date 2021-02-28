import React, { useRef, useEffect, useState } from "react";
import zipFile from "./BOATCAD.zip";
import keycode from 'keycode';
require("js-dos");
const Dos = window.Dos;


const JsDos = (props) => {
    const ref = useRef(null);
    const [windowCi, setWindowCi] = useState(null);

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current, {
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
                autolock: false,
            }).then((runtime) => {
                return runtime.fs.extract(zipFile, "/boatcad").then(() => {
                    return runtime.main(["-c", "cd boatcad", "-c", "BOAT.EXE"]);
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

    return (
    <div className="canvasParent">
      <canvas className="dosCanvas" ref={ref}/>
    </div> 
    );
}

export default JsDos;