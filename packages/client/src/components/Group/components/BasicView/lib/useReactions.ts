import emojiRegex from 'emoji-regex';
import { useEffect, useState } from 'react';

import { Message } from '../../../lib/useSocketHandler/lib/useChatMessages';
import { StreamsDict } from '../../VideoView/VideoView';

interface Props {
  streams: StreamsDict;
  messages: Message[];
}

export interface Reaction {
  text: string;
}

export default function useReactions(props: Props) {
  const [enhancedStreams, setEnhancedStreams] = useState(props.streams);

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
        setEnhancedStreams(prevStreams => {
          if (!latestMessage.user.id) return prevStreams;
          const stream = prevStreams[latestMessage?.user?.id];

          if (!stream) return prevStreams;

          const reaction = {
            text: latestMessage.message,
          };

          stream.reactions = [...(stream.reactions || []), reaction];

          return {
            ...prevStreams,
            [latestMessage?.user?.id]: stream,
          };
        });

        const removeReaction = () => {
          if (!latestMessage.user.id) return;
          const stream = props.streams[latestMessage?.user?.id];
          if (!stream) return;
          stream.reactions?.shift();
          setEnhancedStreams(prevStreams => {
            if (!latestMessage?.user?.id) return prevStreams;
            return {
              ...prevStreams,
              [latestMessage?.user?.id]: stream,
            };
          });
        };

        window.setTimeout(removeReaction, 5000);
      }
      return;
    }

    setEnhancedStreams(prevStreams => {
      return {
        ...prevStreams,
        ...props.streams,
      };
    });
  }, [props.messages, props.streams]);

  return { enhancedStreams };
}
