import { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { authClearError, authLoginAsyncAction } from '@store/auth/auth.action';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const onFinish = (values) => {
    dispatch(authLoginAsyncAction(values.username, values.password, values.remember));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    let timeout = null;
    if (auth.token) {
      timeout = setTimeout(() => {
        navigate('messages');
      }, 500); // improve UX :D
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [auth.token, navigate]);

  useEffect(() => {
    if (auth.error) {
      notification.error({ message: auth.error });
      dispatch(authClearError());
    }
  }, [auth.error, dispatch]);

  return (
    <div className={styles.thisScreen}>
      <Form
        className={styles.form}
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Form.Item
          label='Username'
          name='username'
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={auth.isLoading} type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
