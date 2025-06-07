import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { voteMeme, addComment } from '../api/memes';
import type { Meme } from '../api/memes';
import CommentSection from './CommentSection';
import { toast } from 'react-toastify';

interface MemeCardProps {
  meme: Meme;
  onMemeUpdate: (updatedMeme: Meme) => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onMemeUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user?.token) {
      toast.error('Please log in to vote');
      return;
    }

    if (isVoting) return;
    setIsVoting(true);

    try {
      console.log('Voting on meme:', meme._id, 'with type:', voteType);
      const updatedMeme = await voteMeme(meme._id, voteType);
      console.log('Vote successful, updated meme:', updatedMeme);
      onMemeUpdate(updatedMeme);
      toast.success('Vote recorded successfully');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) {
      toast.error('Please log in to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (isCommenting) return;
    setIsCommenting(true);

    try {
      console.log('Adding comment to meme:', meme._id, 'with text:', commentText);
      const updatedMeme = await addComment(meme._id, commentText);
      console.log('Comment successful, updated meme:', updatedMeme);
      onMemeUpdate(updatedMeme);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{meme.title}</h2>
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-auto rounded-lg mb-4"
        />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center space-x-1 text-gray-600 hover:text-blue-500 ${
                isVoting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!user?.token || isVoting}
            >
              <span>↑</span>
              <span>{meme.upvotes || 0}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center space-x-1 text-gray-600 hover:text-red-500 ${
                isVoting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!user?.token || isVoting}
            >
              <span>↓</span>
              <span>{meme.downvotes || 0}</span>
            </button>
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-blue-500"
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
        
        {showComments && (
          <div className="mt-4">
            <form onSubmit={handleComment} className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-lg mb-2"
                rows={2}
                disabled={!user?.token || isCommenting}
              />
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 ${
                  isCommenting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!user?.token || !commentText.trim() || isCommenting}
              >
                {isCommenting ? 'Adding...' : 'Comment'}
              </button>
            </form>
            <CommentSection comments={meme.comments || []} />
          </div>
        )}
        <div className="mt-4 text-sm text-gray-500">
          <span>By {meme.user?.username || 'Anonymous'}</span>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
