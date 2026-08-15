const httpMocks = require("node-mocks-http");
const { login, logout, checkAuth } = require("../controllers/Auth");
const User = require("../models/user");
const Settings = require("../models/settings");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/user");
jest.mock("../models/settings");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../configuration/logger", () => ({
    error: jest.fn(),
    info: jest.fn()
}));

describe("Auth Controller", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        process.env.JWT_SECRET = "test-secret";
        process.env.ENVIRONMENT = "development";

        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should return 400 if email or password is not provided", async () => {
            req.body = { email: "test@example.com" };

            await login(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({
                success: false,
                message: "All fields are required",
            });
        });

        it("should return 400 if user does not exist", async () => {
            req.body = { email: "test@example.com", password: "password123" };

            const mockPopulate = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findOne.mockReturnValue(mockPopulate);

            await login(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({
                success: false,
                message: "unable to find the user with this email",
            });
        });

        it("should return 500 if password does not match", async () => {
            req.body = { email: "test@example.com", password: "password123" };

            const mockUser = { _id: "user-id", email: "test@example.com", password: "hashed-password" };
            const mockPopulate = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne.mockReturnValue(mockPopulate);
            Settings.findOne.mockResolvedValue({ _id: "settings-id" });
            bcrypt.compare.mockResolvedValue(false);

            await login(req, res);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                success: false,
                message: "Password is incorrect",
            });
        });

        it("should login user and return a token when credentials are valid", async () => {
            req.body = { email: "test@example.com", password: "password123" };

            const mockUser = { _id: "user-id", email: "test@example.com", password: "hashed-password" };
            const mockPopulate = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findOne.mockReturnValue(mockPopulate);
            Settings.findOne.mockResolvedValue({ _id: "settings-id" });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mocked-token");

            await login(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData().success).toBe(true);
            expect(res._getJSONData().Token).toBe("mocked-token");
            expect(res._getJSONData().message).toBe("Login successfull");
            expect(res.cookies.jwt.value).toBe("mocked-token");
        });
    });

    describe("logout", () => {
        it("should clear jwt cookie and return success message", () => {
            logout(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({
                success: true,
                message: "Logged out successfully"
            });
            expect(res.cookies.jwt.options.maxAge).toBe(0);
        });
    });

    describe("checkAuth", () => {
        it("should return 400 if user id is missing in req", async () => {
            req.user = { user: {}, token: "some-token" };

            await checkAuth(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({
                message: "User id not found"
            });
        });

        it("should return 404 if user is not found in database", async () => {
            req.user = { user: { _id: "user-id" }, token: "some-token" };

            const mockPopulate = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null)
            };
            User.findById.mockReturnValue(mockPopulate);

            await checkAuth(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual({
                message: "User not found"
            });
        });

        it("should return 200 and user data if valid", async () => {
            req.user = { user: { _id: "user-id" }, token: "some-token" };

            const mockUser = { _id: "user-id", email: "test@example.com" };
            const mockPopulate = {
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockUser)
            };
            User.findById.mockReturnValue(mockPopulate);

            await checkAuth(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({
                success: true,
                message: "Successfully checked",
                data: {
                    user: mockUser,
                    token: "some-token"
                }
            });
        });
    });
});
