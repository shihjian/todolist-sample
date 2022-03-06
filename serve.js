const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { runInNewContext } = require("vm");
const errorHandle = require("./errorHandle");
const todos = [];

const requestListener = (req, res) => {
  //設定CORS錶頭
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  // 接取HTTP封包
  let = body = "";
  req.on("data", (chunk) => {
    console.log(chunk);
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        Status: "SUCCESS",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          // 使用JSON.parse解析成物件格式。
          let todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          console.log(title);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              Status: "SUCCESS",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        Status: "SUCCESS",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((element) => element.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          Status: "SUCCESS",
          data: todos,
          data: "hello",
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        // 確認傳送過來的值是否正確
        const todo = JSON.parse(body).title;
        // 抓取ID
        const id = req.url.split("/").pop();
        // 判斷todos中有無這個東西
        const index = todos.findIndex((element) => element.id == id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              Status: "SUCCESS",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else {
    res.writeHead(404, headers);
    res.write("404 not find");
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
