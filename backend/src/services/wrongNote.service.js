import WrongNote from "../models/wrongNode.model.js";

export const getWrongNotesByUser = async (userId) => {
        return await WrongNote.find({ userId })
                .select("rawQuestion userAnswer correctAnswer explanation quizId techniqueId createdAt ")        
                .sort({ createdAt: -1 });
};

export const deleteWrongNote = async (userId, noteId) => {
        const result = await WrongNote.findOneAndDelete({ _id: noteId, userId });

        return result;
};