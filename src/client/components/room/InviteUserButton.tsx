import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useAppContext } from '../../../client/hooks/useAppContext';
import { Button } from 'antd';

interface Props {
  roomId: string;
}

export const InviteUserButton = (props: Props) => {
  const { roomId } = props;
  const { config } = useAppContext();

  const [copyState, setCopyState] = React.useState<{ value: string; copied: boolean }>({
    value: `${config.webSocketInviteUserLink}?roomName=${roomId}`,
    copied: false,
  });

  return (
    <CopyToClipboard
      onCopy={() => setCopyState({ value: copyState.value, copied: true })}
      text={copyState.value}
    >
      <Button>Invite User to Room</Button>
    </CopyToClipboard>
  );
};
