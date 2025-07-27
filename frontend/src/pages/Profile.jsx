import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import ProfilePostCard from '../components/ProfilePostCard';
import { usePageStore } from "../store/PageStore";
import UpdatePostHandler from "../components/UpdatePostHandler";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore } from '../store/ProfileStore';
import { Loader } from 'lucide-react';
import { toast } from "react-hot-toast";
import { usePostStore } from '../store/PostStore';
import EditProfile from '../components/EditProfile';
import FollowListModal from "../components/FollowListModal";
import { IoCameraOutline } from "react-icons/io5";
import ProfilePhoto from '../components/ProfilePhoto';

const Profile = () => {
  const { authUser } = useAuthStore();
  const { isUpdatePostOpen, updatePost } = usePageStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { deletePost } = usePostStore();
  const [deletePostid, setDeletePostid] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [postUpdated, setPostUpdated] = useState(false);
  const [posts, setPosts] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const navigate = useNavigate();
  const { fetchUserProfile, editProfileInfo, Followuser, unFollowUser, getFollowers, getFollowings } = useProfileStore();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [Followers, setFollowers] = useState([]);
  const [FollowersId, setFollowersId] = useState([]);
  const [Followings, setFollowings] = useState([]);
  const [FollowingsId, setFollowingsId] = useState([]);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [profilePicOpen, setProfilePicOpen] = useState(false);

  useEffect(() => {
    setDeleted(false);
    setLiked(false);
    const fetchProfileData = async () => {
      setLoading(true);
      const response = await fetchUserProfile(userId);
      const followers = await getFollowers(userId);
      setFollowers(followers);
      const followersId = followers.map(user => user._id);
      const followings = await getFollowings(userId);
      setFollowings(followings);
      const followingsId = followings.map(user => user._id);
      setFollowersId(followersId);
      setFollowingsId(followingsId);
      setUser(response.data || []);
      setPosts(response.data.profile.posts);
      setLoading(false);
    };
    fetchProfileData();
    setTimeout(() => setPostUpdated(false), 2000);
  }, [deleted, postUpdated, liked]);

  const deletePostHandler = async () => {
    const success = await deletePost(deletePostid);
    if (!success) toast.error("Error deleting post!");
    else {
      toast.success("Post deleted successfully!");
      setDeletePostid(null);
      setIsDeleteModalOpen(false);
      setDeleted(true);
    }
  };

  const followUnfollowUser = async () => {
    const isFollowing = FollowersId.includes(authUser._id);
    setLoading(true);
    if (!isFollowing) await Followuser(userId);
    else await unFollowUser(userId);
    setLiked(true);
    setLoading(false);
  };

  const handleFollowEdit = () => {
    if (authUser && user._id === authUser._id) {
      setEditProfile(true);
    } else {
      followUnfollowUser();
    }
  };

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    const success = await editProfileInfo(data);
    setLiked(true);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen accent-bg-mode accent-text-mode">
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm">
          <Loader className="animate-spin" />
        </div>
      )}

      <div className="max-w-[66rem] mx-auto px-4 sm:px-6 py-10 transition-colors duration-300">
        <div className="rounded-lg">
          {!user ? (
            <div className="text-center text-lg">Unable to load user profile.</div>
          ) : (
            <>
              <div className="rounded-xl p-6 flex flex-col md:flex-row items-start justify-between shadow-accent-box accent-border border gap-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 w-full md:w-auto">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0">
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="rounded-full object-cover w-full h-full"
                    />
                    {user._id === authUser._id && <IoCameraOutline
                      onClick={() => setProfilePicOpen(true)}
                      className="absolute hover:-translate-y-1 transition-all duration-500 m-1 h-7 w-7 bottom-[0.15rem] right-[0.20rem] backdrop-blur-xl text-white p-[0.15rem] rounded-full text-xl cursor-pointer shadow-md"
                    />}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold accent-text">{user.firstName + " " + user.lastName}</h1>
                    <p className="text-sm">Joined on {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                    <p className="mt-2 text-sm">{user.profile.bio}</p>
                    <button
                      onClick={handleFollowEdit}
                      className="mt-4 accent-bg hover:accent-bg-dark text-sm font-medium py-1.5 px-4 rounded-md transition-all duration-150"
                    >
                      {authUser && user._id === authUser._id ? "Edit Profile" : FollowersId.includes(authUser._id) ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>

                {/* Right Section: Follower Count */}
                <div className="flex sm:flex-row md:flex-col gap-6 items-center w-full md:w-auto justify-around md:justify-center border-t pt-4 md:border-t-0 md:border-l md:pl-6">
                  <div onClick={() => setFollowerModal(true)} className="text-center cursor-pointer">
                    <p className="text-xl font-bold">{user.profile.followers.length}</p>
                    <p className="text-sm font-medium">Followers</p>
                  </div>
                  <div onClick={() => setFollowingModal(true)} className="text-center cursor-pointer">
                    <p className="text-xl font-bold">{user.profile.following.length}</p>
                    <p className="text-sm font-medium">Following</p>
                  </div>
                </div>
              </div>

              {/* User Posts */}
              <div className="mt-10">
                <h2 className="text-lg font-semibold accent-text pb-3">
                  <span className="accent-underline">Posts</span> - {posts.length}
                </h2>
                <div className="h-[0.12rem] rounded-full accent-bg-light"></div>
                <div className="mt-6 space-y-6">
                  {posts && posts.length > 0 ? (
                    posts.map((post, index) => (
                      <ProfilePostCard
                        key={index}
                        setLiked={setLiked}
                        post={post}
                        setDeletePostid={setDeletePostid}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                      />
                    ))
                  ) : (
                    <p className="text-center text-sm mt-4">No posts found.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[90%] sm:w-[400px] accent-bg-mode p-6 rounded-2xl shadow-accent-box relative">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-xl hover:rotate-90 hover:scale-75 transition-all duration-500"
            >
              <IoMdClose />
            </button>
            <h2 className="text-2xl font-semibold accent-text mb-3">Delete Post</h2>
            <p className="accent-text-mode mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border accent-border accent-text-mode transition-all duration-500 hover:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={deletePostHandler}
                className="px-4 py-2 rounded-lg accent-bg transition-all duration-200 hover:opacity-80 text-white shadow-accent-box"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdatePostOpen && (
        <UpdatePostHandler post={updatePost} setPostUpdated={setPostUpdated} />
      )}

      {authUser && (
        <EditProfile
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          onSubmit={handleProfileUpdate}
          initialValues={{
            firstName: `${authUser.firstName}`,
            lastName: `${authUser.lastName}`,
            email: `${authUser.email}`,
            bio: `${authUser?.profile.bio}`,
          }}
        />
      )}

      {followerModal && (
        <FollowListModal
          isOpen={followerModal}
          onClose={() => setFollowerModal(false)}
          title="Followers"
          users={Followers}
        />
      )}

      {followingModal && (
        <FollowListModal
          isOpen={followingModal}
          onClose={() => setFollowingModal(false)}
          setLiked={setLiked}
          title="Following's"
          users={Followings}
        />
      )}

      {profilePicOpen && (
        <ProfilePhoto setLiked={setLiked} setProfilePicOpen={setProfilePicOpen} user={user} />
      )}
    </div>
  );
};

export default Profile;
