import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';
import {
    fetchPosts,
    likePost,
    fetchPostComments,
    selectHomeState,
    addComment
} from '../stores/home/homeSlice';


interface HomeContextType {
  posts: any[];
  postsLoading: boolean;
  commentsLoading: boolean;
  postComments: any[];
  error: any;
  fetchPosts: (category: any) => void;
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
    const { posts, fetchPostsLoading,fetchCommentsLoading, error,postComments } = useSelector(selectHomeState);

    const handleFetchPosts = async (category: any) => {
      try {
        await dispatch(fetchPosts(category)).unwrap();
      } catch (err: any) {
        console.error(err);
      }
    };

    const handleLikePost = async (postId: string) => {
        try {
            await dispatch(likePost(postId)).unwrap();
        } catch (err: any) {
            console.error(err);
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
        <HomeContext.Provider value={{ posts, error, postComments,
            fetchPosts: handleFetchPosts ,
            postsLoading: fetchPostsLoading,
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