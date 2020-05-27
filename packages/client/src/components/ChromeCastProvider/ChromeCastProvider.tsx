import { styled } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';

import { noop } from '../../constants';

interface ChromeCastValues {
  getCastContext: () => cast.framework.CastContext | null;
}

export const ChromeCastContext = React.createContext<ChromeCastValues>({
  getCastContext: noop,
});

const S = {
  ChromeCastButton: styled('div')({
    width: '20px',
    cursor: 'pointer',
  }),
};

export const ChromeCastButton = () => {
  const buttonWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonWrapperRef.current) {
      const button = document.createElement('google-cast-launcher');
      buttonWrapperRef.current.appendChild(button);
    }
  }, []);

  return <S.ChromeCastButton ref={buttonWrapperRef} />;
};

interface Props {
  children: React.ReactNode;
}

const CHROMECAST_SENDER_SDK =
  'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

export function ChromeCastProvider(props: Props) {
  const getCastContext = () => {
    return cast.framework.CastContext.getInstance();
  };

  const value = {
    getCastContext,
  };

  useEffect(() => {
    const loadCastScript = () => {
      const scriptTag = document.createElement('script');
      scriptTag.async = true;
      scriptTag.src = CHROMECAST_SENDER_SDK;
      const body = document.getElementsByTagName('body')[0];
      body.appendChild(scriptTag);
    };

    const initializeCastApi = () => {
      if (!chrome) return;
      cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });
    };

    loadCastScript();

    window['__onGCastApiAvailable'] = function(isAvailable) {
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }, []);

  return (
    <ChromeCastContext.Provider value={value}>
      {props.children}
    </ChromeCastContext.Provider>
  );
}
