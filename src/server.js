const express = require("express");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { renderToPipeableStream } = require("react-dom/server");
const { createReadStream } = require("fs");
const App = require("./src/App").default;
const fs = require("fs");
const template = fs.readFileSync(
  path.resolve(__dirname, "build/index.html"),
  "utf8"
);

const app = express();

app.use(express.static(path.resolve(__dirname, "build")));

app.get("*", (req, res) => {
  const stream = renderToPipeableStream(React.createElement(App), {
    onShellReady() {
      res.setHeader("Content-Type", "text/html");
      stream.pipe(res);
    },
    onAllReady() {
      res.setHeader("Content-Type", "text/html");
      stream.pipe(res);
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
