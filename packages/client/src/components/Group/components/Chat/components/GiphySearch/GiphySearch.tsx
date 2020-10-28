import 'emoji-mart/css/emoji-mart.css';

import {
  Grid, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
} from '@giphy/react-components';
import { createStyles, makeStyles, Popover, Theme } from '@material-ui/core';
import GifTwoToneIcon from '@material-ui/icons/GifTwoTone';
import React, { forwardRef, useContext, useRef, useState } from 'react';

import * as S from './GiphySearch.styles';

interface Props {
  onGifClick: (gif: string) => void;
  onExited: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    giphySearchBar: {
      height: '32px',
    },
  }),
);
function GiphySearch(props: Props) {
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);

  const gifAnchorElementRef = useRef<HTMLDivElement>(null);

  const classes = useStyles(props);

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

  const GiphySearchContainer = forwardRef(() => (
    <S.GiphyWrapper>
      <SearchContextManager apiKey={process.env.REACT_APP_GIPHY_API_KEY || ''}>
        <SearchBar
          placeholder="search..."
          clear
          className={classes.giphySearchBar}
        />
        <GiphyResults />
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
          width={window.innerWidth > 800 ? 780 : window.innerWidth - 40}
          fetchGifs={fetchGifs}
          onGifClick={onGifSelect}
        />
      </>
    );
  };

  return (
    <>
      <S.GiphySearch
        tabIndex={1}
        onClick={handleGifClick}
        ref={gifAnchorElementRef}
      >
        <GifTwoToneIcon />
      </S.GiphySearch>
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
