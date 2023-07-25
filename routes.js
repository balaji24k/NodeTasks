const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    fs.readFile("message.txt", { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log("err>>>>", err);
      }
      // console.log("data>>>>",data);
      res.write("<html>");
      res.write("<head><title>My First Page</title></head>");
      res.write(
        `<body><h3>${data}</h3><form action="/message" method="POST"><input type="text" name="message" placeholder="Name"><button>Send</button></form></body>`
      );
      res.write("</html>");
      return res.end();
    });
  } else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log("chunk>>>>", chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      // console.log("Body>>>>>>>",body);
      const parsedBody = Buffer.concat(body).toString();
      console.log("parsedBody>>>>", parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) {
          console.log("err>>>>", err);
        }
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write("<body><h1>Hello from Node.js server</h1></body>");
    res.write("</html>");
    res.end(); //we cannot change res after this, it will to res to data
  }
};

module.exports = requestHandler;


//---If we want export more from same filr
// module.exports = {
//   hanlder : requestHandler,
//   someText : "Some Hard Coded Text"
// };

// other way
// module.exports.handler = requestHandler;
// module.exports.someText = "some text written"

//shortcut supported by node js
// exports.handler = requestHandler;
// exports.someText = "some text written"
