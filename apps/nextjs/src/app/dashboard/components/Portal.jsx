import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const [mount, setMount] = useState(false);
  const [el, setEl] = useState(null);

  useEffect(() => {
    setEl(document.createElement('div'));
    setMount(true);
  }, []);

  useEffect(() => {
    if (el) {
      document.body.appendChild(el);
    }

    return () => {
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, [el]);

  if (mount && el) {
    return createPortal(children, el);
  }

  return null;
};

export default Portal;
