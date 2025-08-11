import { create } from "zustand";
import axiosinctance from "./axios.js";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth.js";



const messageChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMesaageLoading: false,




    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosinctance.get("/message/allusers");
            set({ users: res.data })
        } catch (error) {
            console.log(error);
            toast.error(error)
        } finally {
            set({ isUserLoading: true })
        }
    },


    getMessages: async (userId) => {
        set({ isMesaageLoading: true })
        try {
            const res = await axiosinctance.get(`/message/get-messages/${userId}`)
            set({ messages: res.data.data })
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    },


    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) {
            console.error("No user selected to send a message to.");
            return;
        }

        try {
            const res = await axiosinctance.post(
                `/message/sendmessage/${selectedUser._id}`,
                messageData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (res.data.status) {
                set({ messages: [...messages, res.data.data] });
            } else {
                console.error("Failed to send message:", res.data.message);
            }

        } catch (error) {
            console.error("Error while sending message:", error);
        }
    },

    subScribeMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuth.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        })

    },
    unSubscribeMessage: () => {
        const socket = useAuth.getState().socket;
        socket.off("newMessage");
    },



    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))


export default messageChatStore