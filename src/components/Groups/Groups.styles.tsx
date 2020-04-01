import Fab, { FabProps } from '@material-ui/core/Fab';
import { IconProps } from '@material-ui/core/Icon/Icon';
import { styled } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

type AddButtonProps = FabProps & {
  spacing: number;
};

const AddButton = styled(Fab)({
  position: 'fixed',
  bottom: props => props.spacing,
  right: props => props.spacing,
}) as React.ComponentType<AddButtonProps>;

type AddButtonIconProps = IconProps & {
  spacing: number;
};

const AddButtonIcon = styled(AddIcon)({
  marginRight: props => props.spacing,
}) as React.ComponentType<AddButtonIconProps>;

export { AddButton, AddButtonIcon };
