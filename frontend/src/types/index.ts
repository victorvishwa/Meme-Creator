export interface User {
    id: string;
    username: string;
    avatar?: string;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    createdAt: string;
}

export interface Meme {
    id: string;
    imageUrl: string;
    caption: string;
    author: User;
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
    comments: Comment[];
    badges?: ('meme_of_day' | 'weekly_champion')[];
    createdAt: string;
} 