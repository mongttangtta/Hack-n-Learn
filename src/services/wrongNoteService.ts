import axios from 'axios';

export const getWrongNote = async () => {
  try {
    const response = await axios.get('/api/wrongnote');
    return response.data;
  } catch (error) {
    console.error('Error fetching wrong note:', error);
    throw error;
  }
};

export const deleteWrongNote = async (noteId: string) => {
  try {
    const response = await axios.delete(`/api/wrongnote/${noteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting wrong note with ID ${noteId}:`, error);
    throw error;
  }
};
