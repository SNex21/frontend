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
    id: string;
    essay_id: number;
    status: string;
    score: number;
    review: string;
    download_essay_file_url: string;
    download_user_file_url: string;
    deadline: string;
}
  
export interface UserEssayShort {
    id: string;
    essay_id: number;
    title: string;
    status: string;
 }

export interface PaymentLink {
    link: string;
}
