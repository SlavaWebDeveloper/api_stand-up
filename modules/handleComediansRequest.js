import { sendData, sendError } from "./send.js";

export const handleComediansRequest = async (req ,res, comedians, segmets) => {

  if (segmets.length === 2) {
    const comedian = comedians.find(
      (c) => c.id === segmets[1]
    );

    if (!comedian) {
      sendError(res, 404, 'Stand up comediand no found');
      return;
    }
    sendData(res, comedian);
    return;
  }

  sendData(res, comedians);
}