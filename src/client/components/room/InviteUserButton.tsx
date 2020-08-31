import React from 'react';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useAppContext } from '../../../client/hooks/useAppContext';
import { Button } from 'antd';

interface Props {
  roomId: string;
}

export const InviteUserButton = (props: Props) => {
  const { roomId } = props;
  const { config } = useAppContext();

  const [copyState, setCopyState] = React.useState(false);

  const copyText = `${config.webSocketInviteUserLink}?roomName=${roomId}`;
  const copyButton = (
    <Button style={{ minWidth: '154px' }}>{copyState ? 'Copied' : 'Invite User to Room'}</Button>
  );

  const onCopy = () => {
    setCopyState(true);
    _.delay(() => setCopyState(false), 1500);
  };

  return (
    <>
      <CopyToClipboard text={copyText} onCopy={onCopy}>
        {copyButton}
      </CopyToClipboard>
    </>
  );
};
