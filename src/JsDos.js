import React, { useRef, useEffect } from "react";
import zipFile from "./BL3D.zip";
require("js-dos");
const Dos = window.Dos;


const JsDos = () => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref !== null) {
            const ciPromise = Dos(ref.current, {
                wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
                cycles: 1000,
                autolock: false,
            }).then((runtime) => {
                return runtime.fs.extract(zipFile).then(() => {
                    return runtime.main(["-c", "BL3D.EXE"]);
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
    <div>
      <canvas ref={ref} />
    </div> 
    );
}

export default JsDos;