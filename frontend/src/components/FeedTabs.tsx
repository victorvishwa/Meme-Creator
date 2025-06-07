import React from 'react';
import { Tabs, Tab, Box, useTheme } from '@mui/material';

export type FeedType = 'new' | 'top24h' | 'topWeek' | 'topAllTime';

interface FeedTabsProps {
  currentFeed: FeedType;
  onFeedChange: (feed: FeedType) => void;
}

const FeedTabs: React.FC<FeedTabsProps> = ({ currentFeed, onFeedChange }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 4,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={currentFeed}
        onChange={(_, value) => onFeedChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
            height: 3,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            minWidth: 100,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
        }}
      >
        <Tab label="New" value="new" />
        <Tab label="Top 24h" value="top24h" />
        <Tab label="Top Week" value="topWeek" />
        <Tab label="Top All Time" value="topAllTime" />
      </Tabs>
    </Box>
  );
};

export default FeedTabs;
