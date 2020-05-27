import { Box, Link as MuiLink } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import theme, { backgroundColor } from '../../lib/theme';

export const FormWrapper = styled(Box)({});

export const Home = styled(Box)({
  overflow: 'auto',
  height: '100%',
});

export const Form = styled('form')({
  background: backgroundColor['800'],
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 7px 12px 15px #00000054',
  width: '100%',
});

export const Header = styled('div')({
  backgroundImage:
    'radial-gradient(at 0% 0%, rgba(0, 0, 0, 0.75) 0%, rgba(0,0,0,0) 50%);',
  height: '200px',
  position: 'absolute',
  width: '260px',
});

export const Hero = styled(Box)({
  position: 'relative',
  width: '100%',
  backgroundImage: ({ path }: { path: string }) => `url("${path}")`,
  backgroundSize: 'cover',
});

export const Citation = styled(MuiLink)({
  left: '8px',
  color: 'white',
  bottom: '8px',
  padding: '2px 9px',
  position: 'absolute',
  borderRadius: '10px',
  backgroundColor: '#1e1f24c9',
  fontSize: '14px',
  fontWeight: 700,
});

export const Features = styled(Box)({
  position: 'relative',
  padding: '80px 0',
  backgroundColor: theme.palette.primary.main,
  '&::before': {
    content: '""',
    backgroundImage: `url("${process.env.PUBLIC_URL}/inspiration-geometry.png")`,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    opacity: 0.5,
    backgroundSize: '500px',
    pointerEvents: 'none',
  },
});

export const Title = styled('h1')({
  fontSize: '60px',
  fontWeight: 700,
  backgroundColor: theme.palette.primary.main,
  display: 'inline-block',
  lineHeight: '60px',
  letterSpacing: '-5px',
  padding: '12px',
});

export const Feature = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
  padding: '0 40px',
});
export const FeatureIcon = styled(Box)({
  fontSize: '40px',
});
export const FeatureTitle = styled(Box)({
  fontSize: '28px',
  fontWeight: 700,
});
export const FeatureDescription = styled(Box)({
  fontSize: '16px',
  color: '#ffffffbf',
});

export const Footer = styled('footer')({
  padding: '20px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  justifyContent: 'space-between',
});

export const FooterLink = styled(MuiLink)({
  color: theme.palette.primary.light,
  display: 'inline-block',
});

export const FooterMessage = styled('div')({
  color: '#ffffff47',
});
