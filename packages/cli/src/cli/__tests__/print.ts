import { print } from "../print";

jest.spyOn(process.stdout, "write");

describe("when write succeed", () => {
  beforeEach(async () => {
    (process.stdout.write as jest.Mock).mockImplementation((data, cb) => cb());
    await print("foo");
  });

  test("should call write once", () => {
    expect(process.stdout.write).toHaveBeenCalledTimes(1);
  });

  test("should call write with data", () => {
    expect(process.stdout.write).toHaveBeenCalledWith("foo", expect.anything());
  });
});

describe("when write failed", () => {
  const err = new Error("some error");

  beforeEach(() => {
    (process.stdout.write as jest.Mock).mockImplementation((data, cb) =>
      cb(err)
    );
  });

  test("should throw the error", async () => {
    await expect(print("foo")).rejects.toThrow(err);
  });
});
