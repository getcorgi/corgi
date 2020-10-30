import {
  SearchBar as _SearchBar, // the search bar the user will type into
} from '@giphy/react-components';
import theme, { backgroundColor } from 'lib/theme';
import styled from 'styled-components';

export const GiphySearchIcon = styled('div')({
  cursor: 'pointer',
  color: '#888a96',
  '&:hover': {
    color: theme.palette.primary.main,
  },
});

export const GiphyWrapper = styled.div`
  height: 380px;
`;

export const SearchBar = styled(_SearchBar)`
  && {
    border-radius: 20px;
    overflow: hidden;
    background: ${backgroundColor[700]};

    & > input {
      background: ${backgroundColor[700]};
      border-radius: 20px 0 0 20px;
      color: white;
      padding-left: 24px;
      border: 1px solid transparent;

      &:focus {
        outline: none;
        box-shadow: 0 0 0 4px #6a6abf1f;
        border: 1px solid ${theme.palette.primary.main};
      }
    }
  }
`;

export const SearchWrapper = styled.div`
  padding: 12px;
  box-shadow: 0 2px 6px #00000061;
  position: relative;
  z-index: 1;
`;
