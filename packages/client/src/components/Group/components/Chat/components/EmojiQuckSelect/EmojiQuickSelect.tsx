import { MenuItem } from '@material-ui/core';
import { BaseEmoji, emojiIndex } from 'emoji-mart';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as S from './EmojiQuickSelect.styles';

interface Props {
  anchorElement: Element;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EmojiQuickSelect(props: Props) {
  const [emojiList, setEmojiList] = useState<BaseEmoji[] | null>(null);
  const [currentMatch, setCurrentMatch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
    const keydownHandler = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === 'Enter') {
        e.preventDefault();
        const emoji = emojiList?.[selectedIndex];

        if (emoji) {
          console.log(emoji);
          onEmojiSelect(emoji)();
        }
      }

      if (e.key === 'ArrowUp') {
        setSelectedIndex(idx => {
          if (idx > 0) {
            return idx - 1;
          }
          return idx;
        });
      }
      if (e.key === 'ArrowDown') {
        setSelectedIndex(idx => {
          if (idx < Number(emojiList?.length) - 1) {
            return idx + 1;
          }
          return idx;
        });
      }
    };

    if (props.isOpen) {
      window.addEventListener('keydown', keydownHandler);
    } else {
      window.removeEventListener('keydown', keydownHandler);
    }

    return function cleanup() {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [emojiList, onEmojiSelect, props.isOpen, selectedIndex]);

  useEffect(() => {
    const colonEmojiKeywordRegex = /:[^:\s]*(?:::[^:\s]*)*:/;
    const partialCheck = /:([^:\s]{2,})/;

    const match = props.message.match(partialCheck);
    const fullMatch = props.message.match(colonEmojiKeywordRegex);

    if (match) {
      const searchResults = emojiIndex.search(match[1]) as BaseEmoji[];
      if (searchResults.length) {
        if (fullMatch) {
          const exactEmoji = searchResults.find(emoji => {
            return emoji.colons === fullMatch[0];
          });

          if (!exactEmoji) return;

          props.setMessage(oldMessage => {
            return oldMessage.replace(fullMatch[0], exactEmoji.native);
          });
          setEmojiList(null);
          setCurrentMatch('');

          return;
        }

        setCurrentMatch(match[0]);
        setEmojiList(searchResults.slice(0, 10).reverse());
        return;
      }
    }

    setEmojiList(null);
  }, [currentMatch, onEmojiSelect, props, props.message]);

  useEffect(() => {
    if (emojiList && !props.isOpen) {
      props.setIsOpen(true);
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
    if (!emojiList && props.isOpen) {
      props.setIsOpen(false);
    }
  }, [emojiList, props]);

  useEffect(() => {
    if (props.isOpen) {
      setSelectedIndex(Number(emojiList?.length) - 1);
    } else {
      setSelectedIndex(Number(-1));
    }
  }, [emojiList, props.isOpen]);

  console.log(selectedIndex);

  return (
    <S.EmojiQuickSelect isOpen={props.isOpen} ref={menuRef}>
      {emojiList &&
        emojiList.map((emoji: BaseEmoji, idx: number) => (
          <MenuItem
            onClick={onEmojiSelect(emoji)}
            selected={idx === selectedIndex}
          >
            <S.MenuItemIcon>{emoji.native}</S.MenuItemIcon>{' '}
            <S.MenuItemLabel>{emoji.colons}</S.MenuItemLabel>
          </MenuItem>
        ))}
    </S.EmojiQuickSelect>
  );
}
