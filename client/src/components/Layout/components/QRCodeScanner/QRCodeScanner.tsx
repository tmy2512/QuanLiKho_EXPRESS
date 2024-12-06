import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";

function QRCodeScanner(props: {
    handleUpdateListData: (data: any) => void;
    show: boolean;
}) {
    const { handleUpdateListData, show } = props;
    const readerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onScanSuccess(
            decodedText: string,
            decodedResult: Html5QrcodeResult
        ) {
            handleUpdateListData(JSON.parse(decodedResult.result.text));
        }

        function onScanFailure(error: string) {}

        if (!readerRef.current) return;

        const html5QRCodeScanner = new Html5Qrcode(readerRef.current.id);
        const didStart = html5QRCodeScanner
            .start(
                {
                    facingMode: "environment",
                },
                {
                    fps: 5,
                },

                onScanSuccess,
                onScanFailure
            )
            .then(() => true)
            .catch((error: string) => console.log(error));

        return () => {
            didStart
                .then(() => {
                    const videoElement = document.querySelector(
                        "video"
                    ) as HTMLVideoElement;
                    videoElement.onplaying = () => {
                        videoElement.pause();
                        html5QRCodeScanner
                            .stop()
                            .catch(() => console.log("Avoid re-render"));
                    };
                })
                .catch(() => console.log("Avoid re-render"));
        };
    }, []);

    return <>{show ? <div ref={readerRef} id="reader"></div> : null}</>;
}

export default QRCodeScanner;
