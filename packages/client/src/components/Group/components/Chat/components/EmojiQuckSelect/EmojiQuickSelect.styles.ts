import { styled } from '@material-ui/core';

export const EmojiIcon = styled('div')({
  cursor: 'pointer',
  color: '#888a96',
  '&:hover': {
    color: '#ffca00',
  },
});

export const EmojiQuickSelect = styled('div')({
  width: '100%',
  position: 'absolute',
  maxHeight: '300px',
  overflowY: 'auto',
  top: '-8px',
  transform: 'translateY(-100%)',
  background: '#222',
  padding: '4px',

  display: ({ isOpen }: { isOpen: boolean }) => (isOpen ? 'block' : 'none'),
});

export const MenuItemIcon = styled('span')({
  fontSize: '18px',
  display: 'inline-block',
  marginRight: '4px',
});

export const MenuItemLabel = styled('span')({
  fontSize: '12px',
  fontWeight: 'bold',
});
