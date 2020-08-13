import React from 'react';
import _ from 'lodash';
import { User } from '../../../common/types';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface Props {
  users: User[];
}

export const UserList = (props: Props) => {
  const { users } = props;

  const userList = _.map(users, (user, index) => {
    return (
      <Title level={3} key={user.username}>
        <Text mark>{user.username}</Text>
      </Title>
    );
  });

  return (
    <div style={{ height: '232px', overflowY: 'auto' }}>
      <h2>Connected users:</h2>
      {userList}
    </div>
  );
};
