import React, { useCallback, useState } from 'react';
import { Button as AntdButton } from 'antd';

const AsyncButton = ({
  onClick,
  children,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const _onClick = useCallback(
    async (e) => {
      setLoading(true);
      try {
        await onClick(e);
      } finally {
        setLoading(false);
      }
    },
    [onClick],
  );
  return (
    <AntdButton onClick={_onClick} loading={loading} {...rest}>
      {children}
    </AntdButton>
  );
};

export default AsyncButton;
