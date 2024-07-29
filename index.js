import http from "http";
import url from "url";
import fs from "fs/promises";
import path from "path";

// function to read files
const readFileAsync = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (err) {
    throw err;
  }
};

//  404 page
let page404;
readFileAsync("./pages/404.html").then((data) => {
  page404 = data;
});

// function to serve a file
const serveFile = async (res, filePath, contentType = "text/html") => {
  try {
    const data = await readFileAsync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(page404);
  }
};

//server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  let filename;
  if (parsedUrl.pathname === "/") {
    filename = "./pages/index.html";
  } else if (req.url === "/about") {
    filename = "./pages/about.html";
  } else if (req.url === "/contact") {
    filename = "./pages/contact-me.html";
  } else {
    filename = path.join("./pages", parsedUrl.pathname);
  }

  console.log(filename);
  await serveFile(res, filename);
});

server.listen(8080, () => {
  console.log("Server is working!");
});
