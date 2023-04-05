import {writeFileSync} from "fs";
import { createInterface } from "readline";




let clientId: string;
let clientSecret: string;
let redirectURI: string;

console.log("1) Go to https://developer.spotify.com/dashboard and create a new app.");
console.log("  - Redirect URI should be http://<host>:8080/authorize");
console.log("2) Open the app settings and fill in the following information.\n");

let rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Client Id: ", (s: string) => {
  clientId = s;
  rl.close();
  rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Client Secret: ", (s: string) => {
    clientSecret = s;
    rl.close();
    rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Redirect URI: ", (s: string) => {
      redirectURI = s;
      rl.close();
      writeFileSync(__dirname + "/auth.json", JSON.stringify({
        basic: Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        redirect: redirectURI,
        id: clientId
      }));
    });
  });
});




