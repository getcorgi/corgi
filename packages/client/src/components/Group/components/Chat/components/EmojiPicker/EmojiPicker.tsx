import 'emoji-mart/css/emoji-mart.css';

import { Popover } from '@material-ui/core';
import EmojiEmotionsTwoToneIcon from '@material-ui/icons/EmojiEmotionsTwoTone';
import { BaseEmoji, Picker } from 'emoji-mart';
import React, { useRef, useState } from 'react';

import theme from '../../../../../../lib/theme';
import * as S from './EmojiPicker.styles';

interface Props {
  onSelect: (emoji: string) => void;
  onExited: () => void;
}

export default function EmojiPicker(props: Props) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const anchorElementRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      setIsEmojiPickerOpen(!isEmojiPickerOpen);
    }
  };

  const handleClose = () => {
    setIsEmojiPickerOpen(false);
  };

  const onEmojiSelect = (emoji: BaseEmoji) => {
    setIsEmojiPickerOpen(false);
    props.onSelect(emoji.native);
  };

  return (
    <>
      <S.EmojiIcon
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={anchorElementRef}
      >
        <EmojiEmotionsTwoToneIcon />
      </S.EmojiIcon>
      <Popover
        open={isEmojiPickerOpen}
        anchorEl={anchorElementRef.current}
        onClose={handleClose}
        onExited={props.onExited}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Picker
          autoFocus={true}
          color={theme.palette.primary.main}
          emoji=""
          onSelect={onEmojiSelect}
          showPreview={false}
          showSkinTones={false}
          theme="dark"
          title=""
        />
      </Popover>
    </>
  );
}
