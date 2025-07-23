import React from 'react';
import { DotsThree, Plus } from 'phosphor-react';
import { Button } from '../../../shared/components/layout/ui/button';
import { Card, CardContent } from '../../../shared/components/layout/ui/card';

interface EmptyStateProps {
  onCreateConversation: () => void;
  isLoading: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateConversation, isLoading }) => {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <Card className="w-96">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DotsThree size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No conversation selected
            </h3>
            <p className="text-gray-600 mb-6">
              Select a conversation from the sidebar or create a new one to start chatting.
            </p>
            <Button onClick={onCreateConversation} disabled={isLoading}>
              <Plus size={16} className="mr-2" />
              Start New Conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;