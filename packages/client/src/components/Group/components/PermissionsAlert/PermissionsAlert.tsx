import Dialog from '@material-ui/core/Dialog';
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
      disableEscapeKeyDown={true}
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
          permissions for this site and refresh the page. If you don't have a
          webcam, you can also join with just a microphone.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
