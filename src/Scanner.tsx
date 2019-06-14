import * as React from "react";
import * as zxing from "@zxing/library";

export const Scanner: React.FC = () => {
  const [code, setCode] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [recording, setRecording] = React.useState<boolean>(false);

  const reader = new zxing.BrowserMultiFormatReader(null, 1000);

  const start = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRecording(true);

    const p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reader.stopAsyncDecode();
      }, 60000 * 1);

      reader
        .decodeFromInputVideoDevice(null, document.getElementById(
          "video"
        ) as HTMLVideoElement)
        .then(resolve)
        .catch(reject);
    })
      .then((result: zxing.Result) => {
        setCode(result.getText());
        stopStreamedVideo();
      })
      .catch(err => {
        console.log(err.message);
        if (
          err.message !==
          "Video stream has ended before any code could be detected."
        ) {
          setErrorMessage(
            "Ha ocurrido un error de lectura de código, intentelo nuevamente."
          );
        }
        stopStreamedVideo();
      });

    p1.catch(error => {
      console.log(error);
    });
  };

  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();
    reader.stopAsyncDecode();
    stopStreamedVideo();
  };

  function stopStreamedVideo() {
    const videoElem: any = document.getElementById("video");
    setRecording(false);

    if (videoElem && videoElem.srcObject) {
      let stream = videoElem.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });

      videoElem.srcObject = null;
    }
  }

  return (
    <div className="container-fluid">
      <div className="w-100 row align-items-center">
        <div className="row">{errorMessage}</div>
        <div className="row">{code}</div>
        <div className="row">
          {!recording && (
            <button id="btnStart" onClick={e => start(e)}>
              Start video recording
            </button>
          )}

          {recording && (
            <button id="btnStop" onClick={e => stop(e)}>
              Stop recording
            </button>
          )}
        </div>
        <div className="row">
          <video id="video" />
        </div>
      </div>
    </div>
  );
};
