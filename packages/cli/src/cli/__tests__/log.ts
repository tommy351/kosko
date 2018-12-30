import BufferList from "bl";
import { Logger } from "../logger";

let logger: Logger;
let bl: BufferList;

beforeEach(() => {
  bl = new BufferList();
  logger = new Logger(bl);
});

test("log", () => {
  logger.log("foo %s", "bar");
  expect(bl.toString()).toEqual("foo bar\n");
});
