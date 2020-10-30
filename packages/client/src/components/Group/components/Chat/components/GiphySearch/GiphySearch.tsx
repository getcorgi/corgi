import {
  Grid, // our UI Component to display the results
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
} from '@giphy/react-components';
import { Box, Popover } from '@material-ui/core';
import GifTwoToneIcon from '@material-ui/icons/GifTwoTone';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import * as S from './GiphySearch.styles';

interface Props {
  onGifClick: (gif: string) => void;
  onExited: () => void;
}

function GiphySearch(props: Props) {
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);

  const gifAnchorElementRef = useRef<HTMLDivElement>(null);

  const handleGifClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsGifPickerOpen(!isGifPickerOpen);
  };

  const handleClose = () => {
    setIsGifPickerOpen(false);
  };

  const onGifSelect = (
    gif: { images: { downsized_medium: { url: string } } },
    e: { preventDefault: () => void },
  ) => {
    e.preventDefault();
    props.onGifClick(gif.images.downsized_medium.url);
    handleClose();
  };

  // HACK: sets focus on input, giphy doesnt expose the ref or an autofocus prop
  useEffect(() => {
    if (isGifPickerOpen) {
      setTimeout(() => {
        const input: HTMLInputElement | null = document?.querySelector(
          '.giphy-search-bar input',
        );

        if (input) {
          input.focus();
        }
      }, 1);
    }
  }, [isGifPickerOpen]);

  const GiphySearchContainer = forwardRef(() => (
    <S.GiphyWrapper>
      <SearchContextManager apiKey={process.env.REACT_APP_GIPHY_API_KEY || ''}>
        <Box display="flex" flexDirection="column" height="100%">
          <S.SearchWrapper>
            <S.SearchBar placeholder="search..." clear />
          </S.SearchWrapper>
          <Box height="100%" overflow="auto" p={1}>
            <GiphyResults />
          </Box>
        </Box>
      </SearchContextManager>
    </S.GiphyWrapper>
  ));

  const GiphyResults = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext);
    return (
      <>
        <Grid
          key={searchKey}
          columns={3}
          width={380}
          fetchGifs={fetchGifs}
          onGifClick={onGifSelect}
        />
      </>
    );
  };

  return (
    <>
      <S.GiphySearchIcon
        tabIndex={1}
        onClick={handleGifClick}
        ref={gifAnchorElementRef}
      >
        <GifTwoToneIcon fontSize="large" />
      </S.GiphySearchIcon>
      <Popover
        open={isGifPickerOpen}
        anchorEl={gifAnchorElementRef.current}
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
        <GiphySearchContainer />
      </Popover>
    </>
  );
}

export default React.memo(GiphySearch);
