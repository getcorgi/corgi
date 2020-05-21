import 'emoji-mart/css/emoji-mart.css';

import { Box, Popover } from '@material-ui/core';
import EmojiEmotionsTwoToneIcon from '@material-ui/icons/EmojiEmotionsTwoTone';
import { BaseEmoji, Picker } from 'emoji-mart';
import React, { useRef, useState } from 'react';

import theme from '../../../../../../lib/theme';
import * as S from './EmojiPicker.styles';

interface Props {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker(props: Props) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const anchorElementRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
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
      <S.EmojiIcon onClick={handleClick} ref={anchorElementRef}>
        <EmojiEmotionsTwoToneIcon />
      </S.EmojiIcon>
      <Popover
        open={isEmojiPickerOpen}
        anchorEl={anchorElementRef.current}
        onClose={handleClose}
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
          emoji=""
          title=""
          color={theme.palette.primary.main}
          showPreview={false}
          showSkinTones={false}
          theme="dark"
          onSelect={onEmojiSelect}
        />
      </Popover>
    </>
  );
}
