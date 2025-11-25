import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchCompleteUserData, closeUserDetailModal } from '../devDashSlice';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { Conversation } from '../types';
import { ChatViewModal } from './ChatViewModal';
import { 
  ModalHeader, 
  UserProfileOverview, 
  ConversationsList
} from './UserDetailModal/index';

export const UserDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userDetailModal } = useAppSelector((state) => state.devDash);
  const { 
    selectedUser, 
    completeUserData, 
    loading, 
    error, 
    isOpen
  } = userDetailModal;

  const [selectedConversationForChat, setSelectedConversationForChat] = useState<Conversation | null>(null);

  useEffect(() => {
    if (isOpen && selectedUser && !completeUserData) {
      dispatch(fetchCompleteUserData(selectedUser.id));
    }
  }, [dispatch, isOpen, selectedUser, completeUserData]);

  const handleClose = () => {
    dispatch(closeUserDetailModal());
  };

  const handleConversationClick = (conversation: Conversation) => {
    // Open the chat view modal
    setSelectedConversationForChat(conversation);
  };

  const handleCloseChatModal = () => {
    setSelectedConversationForChat(null);
  };


  const handleRetryLoadData = () => {
    if (selectedUser) {
      dispatch(fetchCompleteUserData(selectedUser.id));
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <ModalHeader
          selectedUser={selectedUser}
          onClose={handleClose}
        />

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </Card>
                </div>
              )}

              {error && (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading User Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={handleRetryLoadData}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Loading Data
                  </button>
                </Card>
              )}

              {completeUserData && (
                <div className="space-y-6">
                  <UserProfileOverview userData={completeUserData} />
                  <ConversationsList 
                    conversations={completeUserData.conversations}
                    onConversationClick={handleConversationClick}
                  />
                </div>
              )}
        </div>
      </div>
    </div>

    {/* Chat View Modal */}
    {selectedConversationForChat && (
      <ChatViewModal
        conversationId={selectedConversationForChat.id}
        conversationTitle={selectedConversationForChat.title}
        onClose={handleCloseChatModal}
      />
    )}
    </>
  );
};