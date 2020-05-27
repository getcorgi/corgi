import Typography from '@material-ui/core/Typography';
import React from 'react';

import * as S from './Header.styles';

const Header = () => {
  return (
    <S.Header>
      <Typography variant="h6">
        <S.Tooltip title="Alpha!" placement="right" arrow={true}>
          <S.Link href="/">corgi</S.Link>
        </S.Tooltip>
      </Typography>
    </S.Header>
  );
};

export default Header;
