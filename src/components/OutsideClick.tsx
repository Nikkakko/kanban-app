import React, { useEffect } from 'react';

interface OutsideClickProps {
  modalRef: React.RefObject<HTMLDivElement>;
  closeTaskModal: () => void;
  setIsEditingFalse: () => void;
}

const OutsideClick: React.FC<OutsideClickProps> = ({
  modalRef,
  closeTaskModal,
  setIsEditingFalse,
}) => {
  const handleOutsideClick = (e: any) => {
    if (e.target === modalRef.current) {
      closeTaskModal();
      setIsEditingFalse();
    }

    if (e.key === 'Escape') {
      closeTaskModal();
      setIsEditingFalse();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return null;
};

export default OutsideClick;
