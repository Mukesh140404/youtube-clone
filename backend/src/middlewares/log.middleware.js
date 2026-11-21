import fs from 'fs';

export const GenrateLogs = (req,res) => {
    const log = `${new Date().toISOString()} - ${req.method === "GET" ? `${req.method} ==>` : `${req.method} <==`} ${req.url}`;
  fs.appendFile("./backend/src/logs/request-log.txt", `${log}\n`, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}