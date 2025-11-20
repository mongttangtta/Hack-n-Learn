import Resource from "../models/resource.model.js";
import { deleteFileFromR2 } from "../utils/uploadFileToR2.js";

class ResourceService {
        async uploadResource({ title, description, fileUrl, fileKey, fileSize, contentType, userId }) {
                const resource = new Resource.create({
                        title,
                        description,
                        fileUrl,
                        fileKey,
                        fileSize,
                        contentType,
                        uploadedBy: userId
                });
                return resource;
        }

        async getResourceList(){
                return Resource.find()
                .sort({ createdAt: -1 })
                .select("title createdAt fileSize");
        }

        async getResourceDetail(resourceId){
                return Resource.findById(resourceId);
        }

        async deleteResource(resourceId){
                const resource = await Resource.findById(resourceId);
                if(!resource) return null;

                if(resource.fileKey) {
                        await deleteFileFromR2(resource.fileKey);
                }

                await Resource.findByIdAndDelete(resourceId);

                return true;
        }
}

export default new ResourceService();