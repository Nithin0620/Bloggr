const httpMocks = require('node-mocks-http');
const UserProfile = require('../../controllers/UserProfile');
const User = require('../../models/user');
const Profile = require('../../models/profile');
const Notification = require('../../models/notification');
const Settings = require('../../models/settings');
const { cloudinaryInstance } = require('../../configuration/cloudinary');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../../utility/mailSender');
const { io, getReceiverSocketId } = require('../../configuration/socket');
const logger = require('../../configuration/logger');

jest.mock('../../models/user');
jest.mock('../../models/profile');
jest.mock('../../models/notification');
jest.mock('../../models/settings');
jest.mock('../../configuration/cloudinary', () => ({
  cloudinaryInstance: {
    uploader: {
      upload: jest.fn(),
    }
  }
}));
jest.mock('bcrypt');
jest.mock('../../utility/mailSender');
jest.mock('../../configuration/socket', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
  getReceiverSocketId: jest.fn(),
}));
jest.mock('../../configuration/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserProfile Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  describe('viewUserProfile', () => {
    it('should return user details successfully', async () => {
      req.params.id = 'userId';
      const mockUser = {
        _id: 'userId',
        firstName: 'John',
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockUser);
      User.findById = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      await UserProfile.viewUserProfile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
      expect(res._getJSONData().data).toEqual(mockUser);
    });

    it('should return 401 if id not provided', async () => {
      await UserProfile.viewUserProfile(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().success).toBe(false);
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'userId';
      const mockPopulate = jest.fn().mockResolvedValue(null);
      User.findById = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      await UserProfile.viewUserProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().success).toBe(false);
    });
  });

  describe('updateProfileInfo', () => {
    it('should update profile info successfully', async () => {
      req.user = { user: { _id: 'userId' } };
      req.body = { firstName: 'Jane', lastName: 'Doe', bio: 'new bio' };

      const mockUser = {
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        profile: {
          name: 'John Doe',
          bio: 'old bio',
          save: jest.fn(),
        },
        save: jest.fn(),
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockUser);
      User.findById = jest.fn().mockReturnValue({ populate: mockPopulate });

      await UserProfile.updateProfileInfo(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
      expect(mockUser.firstName).toBe('Jane');
      expect(mockUser.profile.name).toBe('Jane Doe');
      expect(mockUser.profile.bio).toBe('new bio');
    });

    it('should return 400 if passwords do not match', async () => {
      req.user = { user: { _id: 'userId' } };
      req.body = { password: 'password', confirmPassword: 'differentpassword' };

      const mockPopulate = jest.fn().mockResolvedValue({});
      User.findById = jest.fn().mockReturnValue({ populate: mockPopulate });

      await UserProfile.updateProfileInfo(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should return 500 on server error', async () => {
      req.user = { user: { _id: 'userId' } };
      req.body = { firstName: 'Jane' };
      User.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error('DB Error')) });

      await UserProfile.updateProfileInfo(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('uploadProfilePic', () => {
    it('should upload profile picture successfully', async () => {
      req.user = { user: { _id: 'userId' } };
      req.file = { path: 'image/path.jpg' };

      const mockUser = {
        _id: 'userId',
        profilePic: '',
        save: jest.fn()
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      cloudinaryInstance.uploader.upload.mockResolvedValue({ secure_url: 'secure_url' });

      await UserProfile.uploadProfilePic(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
      expect(mockUser.profilePic).toBe('secure_url');
    });

    it('should return 400 if image not provided', async () => {
      req.user = { user: { _id: 'userId' } };
      req.file = undefined;

      const mockUser = {
        _id: 'userId',
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await UserProfile.uploadProfilePic(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should return 500 on server error', async () => {
      req.user = { user: { _id: 'userId' } };
      req.file = { path: 'image/path.jpg' };
      User.findById = jest.fn().mockRejectedValue(new Error('DB Error'));

      await UserProfile.uploadProfilePic(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('deleteProfilePic', () => {
    it('should delete profile picture successfully', async () => {
      req.user = { user: { _id: 'userId' } };

      const mockUser = {
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        profilePic: 'url',
        save: jest.fn()
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await UserProfile.deleteProfilePic(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
      expect(mockUser.profilePic).toBe('https://api.dicebear.com/5.x/initials/svg?seed=John Doe');
    });

    it('should return 500 on server error', async () => {
      req.user = { user: { _id: 'userId' } };
      User.findById = jest.fn().mockRejectedValue(new Error('DB Error'));

      await UserProfile.deleteProfilePic(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('followUser', () => {
    it('should follow user successfully', async () => {
      req.user = { user: { _id: 'currentUserId' } };
      req.params.id = 'targetUserId';

      const mockCurrentUser = {
        _id: 'currentUserId',
        email: 'test@example.com',
        firstName: 'John',
        profile: {
          following: [],
          save: jest.fn(),
        }
      };
      const mockTargetUser = {
        _id: 'targetUserId',
        email: 'target@example.com',
        firstName: 'Jane',
        profile: {
          followers: [],
          save: jest.fn(),
        }
      };

      User.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockTargetUser) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCurrentUser) });

      const mockNotification = { _id: 'notificationId' };
      Notification.create = jest.fn().mockResolvedValue(mockNotification);
      Settings.findOne = jest.fn().mockResolvedValue({ emailNotification: true, pushNotification: true });

      getReceiverSocketId.mockReturnValue('socketId');

      await UserProfile.followUser(req, res);

      // wait for setImmediate email mock execution
      await new Promise(resolve => setImmediate(resolve));

      expect(res.statusCode).toBe(200);
      expect(mockTargetUser.profile.followers).toContain('currentUserId');
      expect(mockCurrentUser.profile.following).toContain('targetUserId');
      expect(sendEmail).toHaveBeenCalled();
      expect(io.to).toHaveBeenCalledWith('socketId');
      expect(io.emit).toHaveBeenCalledWith('newNotification', { notification: mockNotification, currentUser: mockCurrentUser });
    });

    it('should return 400 if following self', async () => {
      req.user = { user: { _id: 'userId' } };
      req.params.id = 'userId';

      await UserProfile.followUser(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should return 404 if user not found', async () => {
      req.user = { user: { _id: 'currentUserId' } };
      req.params.id = 'targetUserId';

      User.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(null) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(null) });

      await UserProfile.followUser(req, res);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 if already following', async () => {
      req.user = { user: { _id: 'currentUserId' } };
      req.params.id = 'targetUserId';

      const mockCurrentUser = {
        _id: 'currentUserId',
        profile: {
          following: ['targetUserId'],
          save: jest.fn(),
        }
      };
      const mockTargetUser = {
        _id: 'targetUserId',
        profile: {
          followers: ['currentUserId'],
          save: jest.fn(),
        }
      };

      User.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockTargetUser) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCurrentUser) });

      await UserProfile.followUser(req, res);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow user successfully', async () => {
      req.user = { user: { _id: 'currentUserId' } };
      req.params.id = 'targetUserId';

      const mockCurrentUser = {
        _id: 'currentUserId',
        profile: {
          following: ['targetUserId'],
          save: jest.fn(),
        }
      };
      mockCurrentUser.profile.following.pull = jest.fn();

      const mockTargetUser = {
        _id: 'targetUserId',
        profile: {
          followers: ['currentUserId'],
          save: jest.fn(),
        }
      };
      mockTargetUser.profile.followers.pull = jest.fn();

      User.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockTargetUser) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCurrentUser) });

      await UserProfile.unfollowUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(mockTargetUser.profile.followers.pull).toHaveBeenCalledWith('currentUserId');
      expect(mockCurrentUser.profile.following.pull).toHaveBeenCalledWith('targetUserId');
    });

    it('should return 400 if unfollowing self', async () => {
      req.user = { user: { _id: 'userId' } };
      req.params.id = 'userId';

      await UserProfile.unfollowUser(req, res);

      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if not following user', async () => {
      req.user = { user: { _id: 'currentUserId' } };
      req.params.id = 'targetUserId';

      const mockCurrentUser = {
        _id: 'currentUserId',
        profile: {
          following: [],
          save: jest.fn(),
        }
      };

      const mockTargetUser = {
        _id: 'targetUserId',
        profile: {
          followers: [],
          save: jest.fn(),
        }
      };

      User.findById = jest.fn()
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockTargetUser) })
        .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCurrentUser) });

      await UserProfile.unfollowUser(req, res);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('getFollowersList', () => {
    it('should get followers list successfully', async () => {
      req.params.id = 'userId';

      const mockUser = {
        _id: 'userId',
        profile: {
          followers: ['followerId1', 'followerId2']
        }
      };

      User.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(mockUser) });

      await UserProfile.getFollowersList(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data).toEqual(['followerId1', 'followerId2']);
    });
  });

  describe('getFollowingList', () => {
    it('should get following list successfully', async () => {
      req.params.id = 'userId';

      const mockUser = {
        _id: 'userId',
        profile: {
          following: ['followingId1', 'followingId2']
        }
      };

      User.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue(mockUser) });

      await UserProfile.getFollowingList(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data).toEqual(['followingId1', 'followingId2']);
    });
  });
});
