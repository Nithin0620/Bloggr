const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");
const { protectRoute } = require("../middlewares/auth.middleware");
const User = require("../models/user");

jest.mock("jsonwebtoken");
jest.mock("../models/user");

describe("Auth Middleware - protectRoute", () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        process.env.JWT_SECRET = "test-secret";

        // Clear all mocks
        jest.clearAllMocks();
    });

    it("should return 401 if no token is provided", async () => {
        req.cookies = {}; // No token

        await protectRoute(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            success: false,
            code: "NO_TOKEN",
            message: "Unauthorised - No token provided",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid (JsonWebTokenError)", async () => {
        req.cookies = { jwt: "invalid-token" };
        const invalidError = new Error();
        invalidError.name = "JsonWebTokenError";
        jwt.verify.mockImplementation(() => { throw invalidError; });

        await protectRoute(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            success: false,
            code: "INVALID_TOKEN",
            message: "Unauthorised - Invalid token",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 if user is not found", async () => {
        req.cookies = { jwt: "valid-token" };
        jwt.verify.mockReturnValue({ userId: "nonexistent-id" });

        const mockQuery = {
            select: jest.fn().mockResolvedValue(null)
        };
        User.findById.mockReturnValue(mockQuery);

        await protectRoute(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            success: false,
            code: "USER_NOT_FOUND",
            message: "User not found",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should set req.user and call next if token is valid and user exists", async () => {
        req.cookies = { jwt: "valid-token" };
        jwt.verify.mockReturnValue({ userId: "existing-id" });

        const mockUser = { _id: "existing-id", email: "test@test.com" };
        const mockQuery = {
            select: jest.fn().mockResolvedValue(mockUser)
        };
        User.findById.mockReturnValue(mockQuery);

        await protectRoute(req, res, next);

        expect(User.findById).toHaveBeenCalledWith("existing-id");
        expect(mockQuery.select).toHaveBeenCalledWith("-password");
        expect(req.user).toEqual({ user: mockUser, token: "valid-token" });
        expect(next).toHaveBeenCalled();
    });

    it("should return 200 with JWT_EXPIRED if token has expired", async () => {
        req.cookies = { jwt: "expired-token" };
        const expiredError = new Error();
        expiredError.name = "TokenExpiredError";
        jwt.verify.mockImplementation(() => { throw expiredError; });

        await protectRoute(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            success: false,
            code: "JWT_EXPIRED",
            message: "Token has expired",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 for other errors", async () => {
        req.cookies = { jwt: "valid-token" };
        const otherError = new Error("Some other error");
        jwt.verify.mockImplementation(() => { throw otherError; });

        await protectRoute(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
