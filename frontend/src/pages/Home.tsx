import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMemes, getTrendingMemes, getWeeklyTrendingMemes, getHighlights } from '../api/memes';
import type { Meme, MemesResponse } from '../api/memes';
import MemeCard from '../components/MemeCard';
import FeedTabs, { TabType } from '../components/FeedTabs';
import TrendingHighlight from '../components/TrendingHighlight';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [highlights, setHighlights] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMemes = async (page: number, tab: TabType) => {
    try {
      let response: MemesResponse;
      switch (tab) {
        case 'top24h':
          response = await getTrendingMemes(page);
          break;
        case 'topWeek':
          response = await getWeeklyTrendingMemes(page);
          break;
        default:
          response = await getMemes(page);
      }
      if (page === 1) {
        setMemes(response.memes);
      } else {
        setMemes(prev => [...prev, ...response.memes]);
      }
      setHasMore(response.memes.length === 10);
    } catch (error) {
      toast.error('Failed to load memes');
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await getHighlights();
      setHighlights(response);
    } catch (error) {
      toast.error('Failed to load highlights');
    }
  };

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchMemes(1, activeTab);
    fetchHighlights();
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMemes(currentPage, activeTab);
    }
  }, [currentPage]);

  const handleMemeUpdate = (updatedMeme: Meme) => {
    setMemes(prev => prev.map(meme => 
      meme._id === updatedMeme._id ? updatedMeme : meme
    ));
    setHighlights(prev => prev.map(meme => 
      meme._id === updatedMeme._id ? updatedMeme : meme
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="space-y-8">
            {memes.map(meme => (
              <MemeCard
                key={meme._id}
                meme={meme}
                onMemeUpdate={handleMemeUpdate}
              />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
        <div className="lg:w-1/4">
          <TrendingHighlight memes={highlights} />
        </div>
      </div>
    </div>
  );
};

export default Home; 