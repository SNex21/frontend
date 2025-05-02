export interface TopicEssay {
    id: number;
    title: string;
    description: string;
    image_url: string;
    price: number;
    file_url: string;
    purchased_essays: UserEssay[];
}

export interface UserEssay {
    id: number;
    user_id: number;
    essay_id: number;
    status: string;
    score: number;
    review: string;
    deadline: string;
}
  
export interface UserEssayShort {
    id: number;
    title: string;
    status: string;
 }

