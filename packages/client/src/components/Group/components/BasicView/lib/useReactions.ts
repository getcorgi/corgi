import emojiRegex from 'emoji-regex';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentUserState } from '../../../../../lib/hooks/useUser';
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
  const me = useRecoilValue(currentUserState);

  useEffect(() => {
    if (props.messages.length) {
      const latestMessage = props.messages[props.messages.length - 1];

      if (!latestMessage.user.id) return;

      const emojiMatches = emojiRegex().exec(latestMessage.message);
      const isEmojisOnly = Boolean(
        emojiMatches && !/[a-z0-9]+/i.test(emojiMatches.input),
      );

      const isFiveOrLessEmojis = [...(emojiMatches?.input || [])].length <= 5;

      if (
        latestMessage.createdAt > new Date().getTime() - 1000 &&
        isEmojisOnly &&
        isFiveOrLessEmojis
      ) {
        setReactions(prevReactions => {
          if (!latestMessage.user.id) return prevReactions;

          let userId = latestMessage.user.id;
          if (latestMessage.user.firebaseAuthId === me?.firebaseAuthId) {
            userId = me?.firebaseAuthId || '';
          }

          const reaction = {
            text: latestMessage.message,
            userId,
          };

          return {
            ...prevReactions,
            [userId]: reaction,
          };
        });

        const removeReaction = () => {
          setReactions(prevReactions => {
            if (!latestMessage.user.id) return prevReactions;

            let userId = latestMessage.user.id;
            if (latestMessage.user.firebaseAuthId === me.firebaseAuthId) {
              userId = me.firebaseAuthId || '';
            }

            const newReactions = { ...prevReactions };
            delete newReactions[userId];

            return newReactions;
          });
        };

        window.setTimeout(removeReaction, 5000);
      }
    }
  }, [me, me.firebaseAuthId, props.messages]);

  return { reactions };
}
