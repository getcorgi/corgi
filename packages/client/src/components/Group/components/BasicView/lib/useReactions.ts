import emojiRegex from 'emoji-regex';
import { useEffect, useState } from 'react';

import { Message } from '../../../lib/useSocketHandler/lib/useChatMessages';

interface Props {
  messages: Message[];
}

export interface ReactionMap {
  [userId: string]: Reaction;
}

export interface Reaction {
  text: string;
}

export default function useReactions(props: Props) {
  const [reactions, setReactions] = useState<{ [key: string]: Reaction }>({});

  useEffect(() => {
    if (props.messages.length) {
      const latestMessage = props.messages[props.messages.length - 1];

      if (!latestMessage.user.id) return;

      const emojiMatches = emojiRegex().exec(latestMessage.message);
      const isEmojisOnly = Boolean(
        emojiMatches && !/[a-z0-9]+/i.test(emojiMatches.input),
      );

      if (
        latestMessage.createdAt > new Date().getTime() - 1000 &&
        isEmojisOnly
      ) {
        setReactions(prevReactions => {
          if (!latestMessage.user.id) return prevReactions;
          const reaction = {
            text: latestMessage.message,
            userId: latestMessage.user.id,
          };
          return {
            ...prevReactions,
            [latestMessage?.user?.id]: reaction,
          };
        });

        const removeReaction = () => {
          setReactions(prevReactions => {
            if (!latestMessage.user.id) return prevReactions;

            const newReactions = { ...prevReactions };
            delete newReactions[latestMessage?.user?.id];

            return newReactions;
          });
        };

        window.setTimeout(removeReaction, 5000);
      }
    }
  }, [props.messages]);

  return { reactions };
}
