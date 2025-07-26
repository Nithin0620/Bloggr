import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import ProfilePostCard from '../components/ProfilePostCard';
import {usePageStore} from "../store/PageStore"
import UpdatePostHandler from "../components/UpdatePostHandler"
import {IoMdClose} from "react-icons/io"
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore } from '../store/ProfileStore';
import { Loader } from 'lucide-react';
import {toast} from "react-hot-toast"
import { usePostStore } from '../store/PostStore';
import EditProfile from '../components/EditProfile';
import FollowListModal from "../components/FollowListModal"
import { IoCameraOutline } from "react-icons/io5";

const Profile = () => {
  const {authUser} = useAuthStore();
  const {isUpdatePostOpen,updatePost} = usePageStore();
  const [isDeleteModalOpen,setIsDeleteModalOpen] = useState();
  const [user,setUser] = useState(null);
  const {deletePost} = usePostStore();
  // console.log("isUpdatePostOpen",isUpdatePostOpen)
  // console.log("updatePost",updatePost)
  const [deletePostid,setDeletePostid] = useState(null);
  const [deleted,setDeleted] = useState(false);

  const [postUpdated,setPostUpdated] =  useState(false);

  const deletePostHandler = async()=>{
    console.log(deletePostid)

    const success = await deletePost(deletePostid);
    if(!success) toast.error("error occured in deleting the post!");
    else{
      toast.success("Blog Deleted Successfully");
      setDeletePostid(null);
      setIsDeleteModalOpen(false);
      setDeleted(true);
      
    }
  }

  const navigate = useNavigate();
  const {fetchUserProfile,editProfileInfo,FollowUser,unFollowUser,getFollowers,getFollowings} = useProfileStore();
  const {userId} = useParams();
  const [loading,setLoading] = useState(false);

  const [Followers,setFollowers] = useState([]);
  const [Followings,setFollowings] = useState([]);

  // const [followersfollowingsModal , setFollworrsFollowingsModal] = useState(false);
  const [followerModal,setFollowerModal] = useState(false);
  const [followingModal,setFollowingModal] = useState(false);
  
  const [liked,setLiked] = useState(false);
  useEffect(()=>{
    setDeleted(false)
    setLiked(false);
    const fetchProfileData = async()=>{
      setLoading(true);
      const response = await fetchUserProfile(userId);
      const followers = await getFollowers(userId);
      const followings = await getFollowings(userId);
      setFollowers(followers);
      setFollowings(followings);
      setUser(response.data || []);
      setPosts(response.data.profile.posts);
      setLoading(false);
    }
    fetchProfileData();
    setTimeout(()=>{
      setPostUpdated(false);
    },2000)
  },[deleted,postUpdated,liked])

  const [posts,setPosts] = useState(null);

  const [editProfile,setEditProfile] = useState(false);

  const followUnfollowUser = async()=>{
    const isFollowing = Followers.includes(userId) ? true : false 
    setLoading(true);
    if(!isFollowing){
      const success = await FollowUser(userId);
    }
    else {
      const success = await unFollowUser(userId);
    }
    
    setLiked(true);
    setLoading(false);
  }


  const handlefollowedit = async()=>{

    // console.log("here in function")
    console.log("here in function",authUser && user._id === authUser._id)
    
    if(authUser && user._id === authUser._id){
      setEditProfile(true);
    } 
    else{
      followUnfollowUser();
    }
                        
  }

  const handleProfileUpdate = async(data)=>{
    setLoading(true);
    const success = await editProfileInfo(data);
    setLiked(true);
    setLoading(false);
  }


  return (
  <div className="relative min-h-screen accent-bg-mode accent-text-mode">
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-5 backdrop-blur-sm">
          <Loader className="animate-spin" />
        </div>
      )}

      <div className="flex justify-center mx-auto px-4 py-2 transition-colors duration-300">
        <div className="w-[85%] rounded-lg p-8">
          {!user ? (
            <div className="text-center text-lg">Unable to load user profile.</div>
          ) : (
            <>
              <div className="rounded-xl p-6 flex flex-col md:flex-row items-start justify-between shadow-accent-box accent-border border">
                <div className="flex w-[80%] items-start gap-6 md:w-auto">
                   <div className="relative w-25 h-25 md:w-28 md:h-28">
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="rounded-full object-cover w-full h-full"
                    />
                    <IoCameraOutline className="absolute m-1 h-7 w-7 bottom-[0.15rem] right-[0.20rem] backdrop-blur-xl text-white p-[0.15rem] rounded-full text-xl cursor-pointer shadow-md" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold accent-text">
                      {user.firstName + " " + user.lastName}
                    </h1>
                    <p className="text-sm">
                      Joined on{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-2 text-sm">{user.profile.bio}</p>
                    <button onClick={()=>handlefollowedit()} className="mt-4 accent-bg hover:accent-bg-dark text-sm font-medium py-1.5 px-4 rounded-md transition-all duration-150">
                      {authUser && user._id === authUser._id ? (
                        <div className=''>Edit Profile</div>
                      ) : (
                        <div>{Followers.includes(userId)? "UnFollow" : "Follow" }</div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex md:flex-col pl-12 w-[20%] items-center gap-6 border-l-2 mt-6 md:mt-0 md:w-auto justify-around">
                  <div onClick={()=>setFollowerModal(true)} className="text-center cursor-pointer">
                    <p className="text-xl font-bold">
                      {user.profile.followers.length}
                    </p>
                    <p className="text-sm font-medium">Followers</p>
                  </div>
                  <div onClick={()=>setFollowingModal(true)} className="text-center cursor-pointer">
                    <p className="text-xl font-bold">
                      {user.profile.following.length}
                    </p>
                    <p className="text-sm font-medium">Following</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-semibold  accent-text pb-3">
                  <span className='accent-underline'>Posts</span> - {posts.length}
                </h2> 

                <div className="min-w-full h-[0.12rem] accent-bg-light rounded-full"></div>

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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-[90%] sm:w-[400px] accent-bg-mode p-6 rounded-2xl shadow-accent-box relative">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-red-500 text-xl hover:rotate-90 hover:scale-75 transition-all duration-500"
            >
              <IoMdClose />
            </button>

            <h2 className="text-2xl font-semibold accent-text mb-3">
              Delete Post
            </h2>
            <p className="accent-text-mode mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>

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
      { authUser && <EditProfile
        editProfile={editProfile}
        setEditProfile={setEditProfile}
        onSubmit={handleProfileUpdate}
        initialValues={{
          firstName: `${authUser.firstName}`,
          lastName:  `${authUser.lastName}`,
          email:  `${authUser.email}`,
          bio:  `${authUser?.profile.bio}`,
        }}
      />}
      {
        followerModal && 

        <FollowListModal
          isOpen={followerModal}
          onClose={() => setFollowerModal(false)}
          title="Followers"
          users={Followers}
        />
      }
      {
        followingModal && 

        <FollowListModal
          isOpen={followingModal}
          onClose={() => setFollowingModal(false)}
          title="Following's"
          users={Followings}
        />
      }
    </div>
  );

};

export default Profile;
