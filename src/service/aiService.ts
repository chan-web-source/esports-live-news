import { apiOpen } from '../utils/api';

interface ChatRequest {
  message: string;
  userId: string;
}

export const sendChatMessage = async (request: ChatRequest): Promise<string> => {
  try {
    const response = await apiOpen.post<RestResponse<string>>('/ai/chat', request);
    return response.data.data || '';
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};