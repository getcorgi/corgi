import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

export default function PermissionsAlert(props: Props) {
  return (
    <Dialog
      open={props.isOpen}
      disableBackdropClick={true}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Oops! Your camera and microphone are blocked'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Corgi requires access to your camera and microphone. Check your
          permissions for this site and refresh the page. Things might be
          weird...
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}
