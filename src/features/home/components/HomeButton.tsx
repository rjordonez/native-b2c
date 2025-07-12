import React from 'react';
import Button from '../../../shared/components/ui/Button';

interface HomeButtonProps {
  label: string;
  count: number;
  onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ label, count, onClick }) => {
  return (
    <Button onClick={onClick} variant="primary">
      {label} (clicked {count} times)
    </Button>
  );
};

export default HomeButton;