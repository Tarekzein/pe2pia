import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';
import {
    fetchPosts,
    createPost,
    deletePost,
    likePost,
    fetchPostComments,
    selectHomeState,
    addComment,
} from '../stores/home/homeSlice';


interface HomeContextType {
  posts: any[];
  postsLoading: boolean;
  createPostLoading: boolean;
  commentsLoading: boolean;
  postComments: any[];
  error: any;
  createPostError: any;
  fetchPosts: (category: any) => void;
  createPost: (post: any) => void;
  deletePost: (postId: string) => void;
  fetchPostComments: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
}

const HomeContext = createContext<HomeContextType | null>(null);


interface HomeProviderProps {
    children: ReactNode;
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, fetchPostsLoading,fetchCommentsLoading,createPostLoading,createPostError, error,postComments } = useSelector(selectHomeState);

    const handleFetchPosts = async (category: any) => {
      try {
        await dispatch(fetchPosts(category)).unwrap();
      } catch (err: any) {
        console.error(err);
      }
    };
    const handleCreatePost = async (post: any) => {
        try {
            await dispatch(createPost(post)).unwrap();
            return 'success';
        } catch (err: any) {
            console.error(err);
            return Promise.reject(err.message || 'Error creating post');
        }
    };
    const handleDeletePost = async (postId: string) => {
        try {
            await dispatch(deletePost(postId)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };
    const handleLikePost = async (postId: string) => {
        try {
            await dispatch(likePost(postId)).unwrap();
        } catch (err: any) {
            throw err;
        }
    };
    const handleFetchPostComments = async (postId: string) => {
        try {
            await dispatch(fetchPostComments(postId)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };
    const handleAddComment = async (postId: string, comment: string) => {
        try {
            await dispatch(addComment({ postId, comment })).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };
    return (
        <HomeContext.Provider value={{ posts, error,createPostError, postComments,
            fetchPosts: handleFetchPosts ,
            createPost: handleCreatePost,
            deletePost: handleDeletePost,
            postsLoading: fetchPostsLoading,
            createPostLoading: createPostLoading,
            commentsLoading: fetchCommentsLoading,
            fetchPostComments: handleFetchPostComments,
            likePost: handleLikePost,
            addComment: handleAddComment,
        }}>
            {children}
        </HomeContext.Provider>
    );
}

const useHome = () => {
    const context = useContext(HomeContext);
    if (!context) {
        throw new Error('useHome must be used within a HomeProvider');
    }
    return context;
}

export { HomeProvider, useHome };
