import * as wrongNoteService from "../services/wrongNote.service.js";

export const getWrongNotes = async (req, res, next) => {
        try {
                const userId = req.session.userId;
                if(!userId) {
                        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                }

                const notes = await wrongNoteService.getWrongNotesByUser(userId);

                return res.json({ success: true, data: notes });
        } catch (error) {
                console.error("Error in getWrongNotes:", error);
                return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
        }
};

export const deleteWrongNote = async (req, res, next) => {
        try {
                const userId = req.session.userId;
                const { noteId } = req.params;

                if(!userId) {
                        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                }

                const deleted = await wrongNoteService.deleteWrongNote(userId, noteId);

                if(!deleted) {
                        return res.status(404).json({ success: false, message: "오답노트를 찾을 수 없습니다." });
                }

                return res.json({ success: true, message: "오답노트가 삭제되었습니다." });
        } catch (error) {
                console.error("Error in deleteWrongNote:", error);
                return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });  
        }
};