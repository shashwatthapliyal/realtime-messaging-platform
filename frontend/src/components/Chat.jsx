
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createSocketConnection } from '@/utils/socket';
import { BASE_URL } from '@/assets/constants';
import axios from 'axios';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const reciever = useLocation().state.user;
  const { firstName, lastName, _id } = reciever;
  const targetUserId = _id;

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/chat/${targetUserId}`,
          { withCredentials: true }
        );

        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err.message);
      }
    }

    fetchChats();
  }, [targetUserId]);

  async function sendMessage(messageText) {
    if (!messageText.trim()) return;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/chat/${targetUserId}/message`,
        { text: messageText.trim() },
        { withCredentials: true }
      );

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err.message);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] min-h-[500px] max-w-7xl overflow-hidden rounded-2xl border border-[#DCE8E5] bg-white shadow-xl shadow-[#203330]/5">

      {/* Left Sidebar */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-[#DCE8E5] bg-[#F4F8F7] md:flex">
        <div className="border-b border-[#DCE8E5] px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#203330]">
            Messages
          </h1>
          <p className="mt-1 text-sm text-[#718580]">
            Stay connected with your people
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#D6E7E3] bg-[#E6F1EF] p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#176F67] to-[#21877D] text-lg font-bold text-white shadow-sm">
              {firstName?.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-[#203330]">
                {firstName} {lastName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#176F67]">
                <span className="h-2 w-2 rounded-full bg-[#176F67]" />
                Your conversation
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <section className="flex min-w-0 flex-1 flex-col bg-white">

        {/* Header */}
        <header className="flex items-center gap-3 border-b border-[#E6EEEB] bg-white px-5 py-4 md:px-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#176F67] to-[#21877D] text-lg font-bold text-white shadow-sm">
            {firstName?.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate font-semibold text-[#203330]">
              {firstName} {lastName}
            </h2>
            <p className="mt-0.5 text-xs text-[#718580]">
              Connectly conversation
            </p>
          </div>

          
        </header>

        {/* Messages */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-gradient-to-b from-[#F4F8F7] to-white px-4 py-6 sm:px-6 md:px-8">

          {messages.length === 0 ? (
            <div className="m-auto flex max-w-sm flex-col items-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#D6E7E3] bg-[#E6F1EF] text-3xl font-bold text-[#176F67] shadow-sm">
                {firstName?.charAt(0)}
              </div>

              <h3 className="text-xl font-bold text-[#203330]">
                Say hello to {firstName}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#718580]">
                This is the beginning of your conversation. Send a message
                and start connecting!
              </p>

              <span className="mt-5 rounded-full border border-[#DCE8E5] bg-white px-4 py-2 text-xs text-[#718580] shadow-sm">
                Your conversation starts here
              </span>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-4">
              {messages.map((msg, index) => {
                const senderId =
                  msg.senderId?._id ?? msg.senderId;

                const isMine =
                  String(senderId) !== String(targetUserId);

                return (
                  <div
                    key={msg._id || index}
                    className={`flex w-full ${
                      isMine ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[82%] break-words px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] ${
                        isMine
                          ? 'rounded-2xl rounded-br-md bg-[#176F67] text-white'
                          : 'rounded-2xl rounded-bl-md border border-[#E0EAE7] bg-white text-[#203330]'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.createdAt && (
                        <p
                          className={`mt-1 text-right text-[10px] ${
                            isMine ? 'text-[#D5EEEA]' : 'text-[#8A9D98]'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Input */}
        <footer className="border-t border-[#DCE8E5] bg-white px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(newMessage);
            }}
            className="flex items-center gap-3 rounded-2xl border border-[#DCE8E5] bg-[#F4F8F7] p-2 transition focus-within:border-[#78B8AF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#E6F1EF]"
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder={`Message ${firstName}...`}
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#203330] outline-none placeholder:text-[#8A9D98]"
            />

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-[#176F67] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125B55] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
            >
              <span>Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>

          <p className="mt-2 text-center text-[11px] text-[#8A9D98]">
            Your conversations, all in one place.
          </p>
        </footer>
      </section>
    </div>
  );
};

export default Chat;
