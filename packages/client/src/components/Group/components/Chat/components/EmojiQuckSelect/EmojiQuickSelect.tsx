import { MenuItem } from '@material-ui/core';
import { BaseEmoji, emojiIndex } from 'emoji-mart';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as S from './EmojiQuickSelect.styles';

interface Props {
  anchorElement: Element;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function EmojiQuickSelect(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [emojiList, setEmojiList] = useState<BaseEmoji[] | null>(null);
  const [currentMatch, setCurrentMatch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const onEmojiSelect = useCallback(
    (emoji: BaseEmoji) => () => {
      setEmojiList(null);

      props.setMessage(oldMessage => {
        return oldMessage.replace(currentMatch, emoji.native);
      });
      setCurrentMatch('');
    },
    [currentMatch, props],
  );

  const scrollToBottom = () => {
    const menu = menuRef?.current;

    if (menu) {
      menu.scrollTop = menu.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [emojiList, isOpen]);

  useEffect(() => {
    const colonEmojiKeywordRegex = /:[^:\s]*(?:::[^:\s]*)*:/;
    const partialCheck = /:([^:\s]{2,})/;

    const match = props.message.match(partialCheck);
    const fullMatch = props.message.match(colonEmojiKeywordRegex);

    if (match) {
      const searchResults = emojiIndex.search(match[1]) as BaseEmoji[];
      if (searchResults.length) {
        if (fullMatch && searchResults.length === 1) {
          const emoji = searchResults[0];

          props.setMessage(oldMessage => {
            return oldMessage.replace(fullMatch[0], emoji.native);
          });
          setEmojiList(null);
          setCurrentMatch('');

          return;
        }

        setCurrentMatch(match[0]);
        setEmojiList(searchResults.slice(0, 20).reverse());
        return;
      }
    }

    setEmojiList(null);
  }, [currentMatch, onEmojiSelect, props, props.message]);

  useEffect(() => {
    if (emojiList && !isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
    if (!emojiList && isOpen) {
      setIsOpen(false);
    }
  }, [emojiList, isOpen]);

  return (
    <S.EmojiQuickSelect isOpen={isOpen} ref={menuRef}>
      {emojiList &&
        emojiList.map((emoji: BaseEmoji) => (
          <MenuItem onClick={onEmojiSelect(emoji)}>
            <S.MenuItemIcon>{emoji.native}</S.MenuItemIcon>{' '}
            <S.MenuItemLabel>{emoji.colons}</S.MenuItemLabel>
          </MenuItem>
        ))}
    </S.EmojiQuickSelect>
  );
}
