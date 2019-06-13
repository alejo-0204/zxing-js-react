import * as React from "react";
import * as zxing from "@zxing/library";

export const Scanner: React.FC = () => {
  const [code, setCode] = React.useState<string>("");
  const [recording, setRecording] = React.useState<boolean>(false);

  const reader = new zxing.BrowserMultiFormatReader();

  const start = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRecording(true);
    reader
      .decodeFromInputVideoDevice(undefined, "video")
      .then(result => {
        if (result) {
          console.log(result);
          setCode(result.getText());
          reader.stopContinuousDecode();
          stopStreamedVideo();
        }
      })
      .catch(err => {
        console.error(err);
        setCode(err.message);
      });
  };
  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();

    reader.stopContinuousDecode();
    stopStreamedVideo();
    setRecording(false);
  };

  function stopStreamedVideo() {
    const videoElem: any = document.getElementById("video");
    if (videoElem) {
      let stream = videoElem.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });

      videoElem.srcObject = null;
    }
  }

  const videito = <video id="video" />;

  return (
    <div className="container-fluid">
      <div className="w-100 row align-items-center">
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
        <div className="row">{videito}</div>
      </div>
    </div>
  );
};
