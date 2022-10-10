import AggregateError from "../AggregateError";

test("only errors is given", () => {
  const errors = [new Error("first"), new Error("second")];
  const err = new AggregateError(errors);

  expect(err.name).toEqual("AggregateError");
  expect(err.errors).toEqual(errors);
  expect(err.message).toEqual("");
});

test("when errors is a Set", () => {
  const errors = new Set([new Error("first"), new Error("second")]);
  const err = new AggregateError(errors);

  expect(err.errors).toEqual([...errors]);
});

test("when message is given", () => {
  const err = new AggregateError([], "foobar");

  expect(err.message).toEqual("foobar");
});

test("when cause is given", () => {
  const cause = new Error("err cause");
  const err = new AggregateError([], "foobar", { cause });

  expect(err.cause).toEqual(cause);
});
