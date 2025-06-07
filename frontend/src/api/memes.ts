import axios from 'axios';
import { API_URL } from '../config';
import { Meme, Comment } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface MemesResponse {
  memes: Meme[];
  hasMore: boolean;
  totalMemes: number;
}

export interface CreateMemeFormData {
  image?: File;
  imageUrl?: string;
  caption: string;
  isDraft: boolean;
}

export interface UserStats {
  totalMemes: number;
  totalViews: number;
  totalUpvotes: number;
  totalDownvotes: number;
  totalComments: number;
}

// API Functions
export const getMemes = async (feedType: string, page: number = 1, limit: number = 12): Promise<MemesResponse> => {
  const response = await api.get(`/memes/${feedType}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserMemes = async (userId: string, page: number = 1, limit: number = 12): Promise<MemesResponse> => {
  const response = await api.get(`/memes/user/${userId}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMemeById = async (id: string): Promise<Meme> => {
  const response = await api.get(`/memes/${id}`);
  return response.data;
};

export const createMeme = async (formData: FormData): Promise<Meme> => {
  try {
    const response = await api.post('/memes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createMeme:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create meme');
    }
    throw error;
  }
};

export const updateMeme = async (id: string, data: Partial<Meme>): Promise<Meme> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.put(`/memes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMeme = async (id: string): Promise<void> => {
  await api.delete(`/memes/${id}`);
};

export const voteMeme = async (memeId: string, voteType: 'up' | 'down'): Promise<Meme> => {
  try {
    const response = await api.post(`/memes/${memeId}/vote`, { voteType });
    return response.data;
  } catch (error) {
    console.error('Error voting on meme:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to vote on meme');
    }
    throw error;
  }
};

export const addComment = async (memeId: string, text: string): Promise<Meme> => {
  try {
    const response = await api.post(`/memes/${memeId}/comments`, { text });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
    throw error;
  }
};

export const deleteComment = async (memeId: string, commentId: string): Promise<void> => {
  await api.delete(`/memes/${memeId}/comments/${commentId}`);
};

export const flagMeme = async (memeId: string): Promise<void> => {
  try {
    await api.post(`/memes/${memeId}/flag`);
  } catch (error) {
    console.error('Error flagging meme:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to flag meme');
    }
    throw error;
  }
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

export const getUserTopMemes = async (userId: string, limit: number = 5): Promise<Meme[]> => {
  const response = await api.get(`/users/${userId}/top-memes?limit=${limit}`);
  return response.data;
};

export const getRelatedMemes = async (memeId: string): Promise<Meme[]> => {
  const response = await api.get(`/memes/${memeId}/related`);
  return response.data;
};

export const getHighlights = async (): Promise<Meme[]> => {
  try {
    const response = await api.get('/memes/highlights');
    return response.data;
  } catch (error) {
    console.error('Error fetching highlights:', error);
    throw error;
  }
}; 