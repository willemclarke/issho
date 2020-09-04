import React from 'react';
import _ from 'lodash';
import useSocket from 'use-socket.io-client';
import { Alert, Button, Col, Form, Input, Row } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Messages } from '../../common/types';
import { useAppContext } from '../hooks/useAppContext';
import { useLocationQuery } from '../../client/hooks/useQuery';
import { randomString } from '../../common/utils';
import { useForm, Controller } from 'react-hook-form';

interface FormValues {
  username: string;
  roomId: string;
}

export const Landing = () => {
  const { config } = useAppContext();
  const { handleSubmit, control, setValue, setError, errors } = useForm<FormValues>();
  const history = useHistory();
  const roomName = useLocationQuery().get('roomName');

  const [socket] = useSocket(config.webSocketApi, {
    autoConnect: true,
    secure: config.webSocketSecure,
  });

  React.useEffect(() => {
    socket.on(Messages.CAN_JOIN_ROOM_RESPONSE, (data: any) => {
      if (data.error) {
        setError('username', { message: data.error });
      } else {
        history.push(`/rooms/${data.roomId}?username=${data.username}`);
      }
    });
  }, [history, socket]);

  const onSubmit = (values: FormValues) => {
    const { roomId, username } = values;
    socket.emit(Messages.CAN_JOIN_ROOM_REQUEST, { roomId: roomName || roomId, username });
  };

  const onClick = () => {
    const generatedRoomName = _.toUpper(randomString(6));
    setValue('roomId', generatedRoomName);
  };

  const UserErrors = () => (
    <>
      {_.map(errors, (error, key) => (
        <Alert message={error?.message} type="error" banner />
      ))}
    </>
  );

  return (
    <>
      <UserErrors />
      <Row justify="center" style={{ marginTop: '2rem' }}>
        <Col xs={4} xxl={5}>
          <form name="landing" className="landing-form" onSubmit={handleSubmit(onSubmit)}>
            {_.isNil(roomName) ? (
              <Controller
                control={control}
                name={'roomId'}
                rules={{ required: 'Please enter room name' }}
                as={
                  <Input
                    placeholder="Enter room name"
                    addonAfter={<HighlightOutlined onClick={onClick} />}
                  />
                }
              />
            ) : null}
            <Controller
              control={control}
              name={'username'}
              rules={{ required: 'Please enter username' }}
              as={<Input placeholder="Enter username" />}
            />
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: '100%' }}
            >
              Join Room
            </Button>
          </form>
        </Col>
      </Row>
    </>
  );
};
