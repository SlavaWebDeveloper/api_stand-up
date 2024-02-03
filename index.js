import http from "node:http"; 
import fs from "node:fs/promises";
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080;
const COMEDIANS = './comedians.json';
export const CLIENTS = './clients.json';



const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods", 
          "GET, POST, PATCH, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
        }

        const segmets = req.url.split("/").filter(Boolean);

        if (req.method === "GET" && segmets[0] === 'comedians') {
          handleComediansRequest(req ,res, comedians, segmets);
          return;
        } 

        if (req.method === "POST" && segmets[0] === "clients") {
          //POST / clients
          // добавление клиента
          handleAddClient(req ,res);
          return;

        }

        if (req.method === "GET" && segmets[0] === "clients" && segmets.length === 2) {
          //GET / clients/:ticket
          // Получение клиента по номеру билета
          const ticketNumber = segmets[1];
          handleClientsRequest(req ,res, ticketNumber);
          return;
        }

        if (req.method === "PATCH" && segmets[0] === "clients" && segmets.length === 2) {
          //PATCH / clients/:ticket
          // Обновление клиента по номеру билета
          handleUpdateClient(req ,res, segmets);
          return;
        }
        sendError(res, 404, 'Not found'); 

      } catch (error) {
        sendError(res, 500, `Ошибка сервера: ${error}`);    
      }

    })
    .listen(PORT);

    console.log(`Сервер запущен на http://localhost:${PORT}`);
}

startServer();

