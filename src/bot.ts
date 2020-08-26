import puppeteer from "puppeteer";
import fs from "fs";
import MessagesController from "./controllers/MessagesController";
import encodeRFC5987ValueChars from "./util/stringToUrl";

const setup = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./puppeteer_data",
  });

  const page = await browser.newPage();
  await page.goto("https://web.whatsapp.com/", { waitUntil: "load" });

  console.log("Waiting for login");
  await page.waitForSelector("._2bBPp");

  console.log("Getting the session");
  const client = await page.target().createCDPSession();
  const response: any = await client.send("Network.getAllCookies");

  console.info("cookies are ", response.cookies);

  fs.writeFile(
    "cookies.json",
    JSON.stringify(response.cookies, null, 2),
    function (err) {
      if (err) throw err;
      console.log("completed write of cookies");
    }
  );

  await browser.close();
};

const bot = async () => {
  const messagesController = new MessagesController();

  const cookiesString = fs.readFileSync("cookies.json", "utf8");
  const cookies = JSON.parse(cookiesString);

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./puppeteer_data",
  });

  const page = await browser.newPage();

  console.info("setting cookies");
  await page.setCookie.apply(page, cookies);

  await page.goto("https://web.whatsapp.com/", { waitUntil: "load" });

  const messages = await messagesController.index();

  console.log(messages);

  for (let message of messages) {
    try {
      await page.goto(
        `https://web.whatsapp.com/send?phone=${
          message.to
        }&text=${encodeRFC5987ValueChars(message.message)}`,
        { waitUntil: "load" }
      );
      await page.waitForSelector("._1U1xa");
      await page.waitFor(3000);
      await page.keyboard.press("Enter");
      await page.waitFor(2000);

      console.log(`Message ${message.id} has just sent`);
    } catch (err) {
      console.log(`Something went wrong on: ${message}`);
    }
  }
};

(async () => {
  await setup();
  await bot();
})();
