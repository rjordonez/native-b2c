import React from 'react';
import { Button } from '../../../shared/components/layout/ui/button';

interface HomeButtonProps {
  label: string;
  count: number;
  onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ label, count, onClick }) => {
  return (
    <Button onClick={onClick} variant="default">
      {label} (clicked {count} times)
    </Button>
  );
};

export default HomeButton;