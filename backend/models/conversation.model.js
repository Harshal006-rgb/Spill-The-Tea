import mongoose from "mongoose"

const converstionSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation', converstionSchema)
export default Conversation