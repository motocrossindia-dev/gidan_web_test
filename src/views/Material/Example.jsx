import React from 'react';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';

const Example = () => {
  const { enqueueSnackbar } = useSnackbar();
  const userProfile = useSelector((state) => state?.auth?.currentUser?.username);
  const handleClick = () => {
    enqueueSnackbar('I love hooks!', {
      variant: 'error', // Adjust the variant as needed

      autoHideDuration: 4000, // Adjust the duration as needed
    });
  };

  return (
    <div>
      <p>
        Hooks are a way to use state and other React features without writing a
        class component.
      </p>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Show snackbar
      </Button>
      <h1>Hello, {userProfile}</h1>
    </div>
  );
};

export default Example;