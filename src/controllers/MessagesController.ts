import { Request, Response } from "express";
import db from "../database/connection";

import numberSanitize from "../util/numberSanitizer";
import isValid from "../util/isValidPhone";

export default class MessagesController {
  async create(req: Request, res: Response) {
    let to = new String(req.body.to);
    let message = new String(req.body.message);

    to = numberSanitize(to);

    if (!isValid(to)) {
      return res.status(400).json({
        error: "the given number is invalid",
      });
    }

    try {
      await db("messages").insert({
        to,
        message,
      });

      console.log("Inserting a new message on the queue");

      return res.status(200).json({
        message: "success, the message is on the queue",
      });
    } catch (err) {
      return res.status(400).json({
        error: "something went wrong, please try again",
      });
    }
  }

  async index() {
    const messages = db.select().from("messages");
    return messages;
  }
}
