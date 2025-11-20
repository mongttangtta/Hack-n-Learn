import resourceService from "../services/resource.service.js";
import { uploadFileToR2 } from "../utils/uploadFileToR2.js";

export default class ResourceController {

        static async upload(req,res) {
                try {
                        const user = req.user;

                        if(!user || user.role !== 'admin') {
                                return res.status(403).json({ message: "권한이 없습니다." });
                        }

                        if(!req.file) {
                                return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
                        }

                        const { title, description } = req.body;
                        
                        const { fileUrl, fileKey } = await uploadFileToR2(req.file);

                        const resource = await resourceService.uploadResource({
                                title,
                                description,
                                fileUrl,
                                fileKey,
                                fileSize: req.file.size,
                                contentType: req.file.mimetype,
                                userId: user._id
                        });

                        return res.status(201).json({ success: true, data: resource });
                } catch (error) {
                        console.error("Error uploading resource:", error);
                        return res.status(500).json({ message: "서버 오류로 인해 자료실 업로드에 실패했습니다." });
                }
        }

        static async list(req,res) {
                try {
                        const list = await resourceService.getResourceList();
                        return res.status(200).json({ success: true, data: list });
                } catch (error) {
                        console.error("Error fetching resource list:", error);
                        return res.status(500).json({ message: "서버 오류로 인해 자료실 목록을 가져오지 못했습니다." });
                }
        }

        static async detail(req,res) {
                try {
                        const { resourceId } = req.params;
                        const resource = await resourceService.getResourceDetail(resourceId);
                        if(!resource) {
                                return res.status(404).json({ message: "자료실을 찾을 수 없습니다." });
                        }

                        return res.status(200).json({ success: true, data: resource });
                } catch (error) {
                        console.error("Error fetching resource detail:", error);
                        return res.status(500).json({ message: "서버 오류로 인해 자료실 상세 정보를 가져오지 못했습니다." });
                }
        }

        static async delete(req,res) {
                try {
                        const user = req.user;

                        if(!user || user.role !== 'admin') {
                                return res.status(403).json({ success:false, message: "권한이 없습니다." });
                        }
                        const { resourceId } = req.params;
                        const resource = await resourceService.deleteResource(resourceId);

                        return res.status(200).json({ success: true, data: resource });
        } catch (error) {
                        console.error("Error deleting resource:", error);
                        return res.status(500).json({ success:false, message: "서버 오류로 인해 자료실 삭제에 실패했습니다." });
                }
        }
}