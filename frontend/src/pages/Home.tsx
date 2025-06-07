import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import FeedTabs, { FeedType } from '../components/FeedTabs';
import MemeCard from '../components/MemeCard';
import { Meme } from '../types';
import { getMemes, voteMeme, addComment, flagMeme } from '../api/memes';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const [currentFeed, setCurrentFeed] = useState<FeedType>('new');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await getMemes(currentFeed, page);
      if (page === 1) {
        setMemes(response.memes);
      } else {
        setMemes((prev) => [...prev, ...response.memes]);
      }
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast.error('Failed to load memes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMemes();
  }, [currentFeed]);

  const handleFeedChange = (feed: FeedType) => {
    setCurrentFeed(feed);
  };

  const handleVote = async (memeId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      const updatedMeme = await voteMeme(memeId, voteType);
      setMemes((prev) =>
        prev.map((meme) => (meme.id === memeId ? updatedMeme : meme))
      );
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleComment = async (memeId: string, comment: string) => {
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    try {
      const updatedMeme = await addComment(memeId, comment);
      setMemes((prev) =>
        prev.map((meme) => (meme.id === memeId ? updatedMeme : meme))
      );
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleFlag = async (memeId: string) => {
    if (!user) {
      toast.error('Please log in to flag content');
      return;
    }

    try {
      await flagMeme(memeId);
      toast.success('Content has been flagged for review');
    } catch (error) {
      console.error('Error flagging meme:', error);
      toast.error('Failed to flag content');
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchMemes();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Meme Community
        </Typography>

        <FeedTabs currentFeed={currentFeed} onFeedChange={handleFeedChange} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {memes.map((meme) => (
            <MemeCard
              key={meme.id}
              meme={meme}
              onVote={handleVote}
              onComment={handleComment}
              onFlag={handleFlag}
            />
          ))}
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <button
              onClick={handleLoadMore}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Load More
            </button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home; 