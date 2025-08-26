import { userModel } from "../models/user.model.js";
import { messageModel } from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import { ConversationModel } from "../models/conversation.model.js";
import { getReceiverSocketId } from "../server.js";
import { io } from "../server.js";


export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const {loginId:myId} = req.body;

        const messages = await messageModel.find({
            $or: [
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId:myId},
            ]
        }).sort({createdAt : 1});
        
        res.status(200).json({success: true, messages})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const {loginId:myId} = req.body;

        let imgUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }
        let conversation = await ConversationModel.findOne({
            participants:{$all:[myId, receiverId]}
        });
        if(!conversation){
            conversation = new ConversationModel({
                participants:[myId, receiverId]
            })
        };

        const newMessage = new messageModel({receiverId, senderId:myId, text, image:imgUrl});
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        await newMessage.save();
        await conversation.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        };

        res.status(201).json({success: true, newMessage})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}