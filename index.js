import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = 8081;

// function to read files
const readFileAsync = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (err) {
    throw err;
  }
};

// 404 page
let page404;
readFileAsync("./pages/404.html").then((data) => {
  page404 = data;
});


// function to serve a file
const serveFile = async (res, filePath, contentType = "text/html") => {
  try {
    const data = await readFileAsync(filePath);
    res.status(200).contentType(contentType).send(data);
  } catch (err) {
    res.status(404).contentType("text/html").send(page404);
  }
};

// routes
app.get("/", async (req, res) => {
  await serveFile(res, "./pages/index.html");
});

app.get("/about", async (req, res) => {
  await serveFile(res, "./pages/about.html");
});

app.get("/contact", async (req, res) => {
  await serveFile(res, "./pages/contact-me.html");
});

app.get("*", async (req, res) => {
  const filePath = path.join("./pages", req.path);
  await serveFile(res, filePath);
});

// start server
app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}!`);
});
