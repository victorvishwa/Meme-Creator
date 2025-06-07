import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  MoreVert,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { Meme } from '../types/meme';

interface MemeCardProps {
  meme: Meme;
  onLike: (memeId: string) => void;
  onShare: (memeId: string) => void;
  onComment: (memeId: string) => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onLike, onShare, onComment }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLiked, setIsLiked] = useState(meme.likes.includes(user?.id || ''));
  const [isUpvoted, setIsUpvoted] = useState(meme.upvotes.includes(user?.id || ''));

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(meme._id);
  };

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    // Add upvote logic here
  };

  return (
    <Card
      sx={{
        maxWidth: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height={isMobile ? 200 : 400}
        image={meme.imageUrl}
        alt={meme.title}
        sx={{
          objectFit: 'cover',
          width: '100%',
        }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={meme.author.avatar}
            alt={meme.author.username}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {meme.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom>
          {meme.title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {meme.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
              <IconButton onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {meme.likes.length}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isUpvoted ? 'Remove Upvote' : 'Upvote'}>
              <IconButton onClick={handleUpvote} color={isUpvoted ? 'primary' : 'default'}>
                {isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {meme.upvotes.length}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Share">
              <IconButton onClick={() => onShare(meme._id)}>
                <Share />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {meme.shares}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Comments">
              <IconButton onClick={() => onComment(meme._id)}>
                <Comment />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {meme.comments.length}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemeCard;
