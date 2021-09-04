import { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, notification, Typography, Row } from 'antd';
import { CommentOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import {
  authClearError,
  authLoginAsyncAction,
  authSignUpAsyncAction,
} from '@store/auth/auth.action';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import { colors } from '@assets/variables/colors';

const { Text, Link } = Typography;

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [password, setPassword] = useState('');

  const auth = useSelector((state) => state.auth);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(
      isLoginMode
        ? authLoginAsyncAction(values.username, values.password, values.remember)
        : authSignUpAsyncAction(
            values.username,
            values.displayname,
            values.password,
            values.remember,
          ),
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (value) => {
    if (value.password) {
      setPassword(value.password);
    }
  };

  const renderLoginFooter = () => (
    <>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button block size='large' loading={auth.isLoading} type='primary' htmlType='submit'>
          Đăng nhập
        </Button>
      </Form.Item>

      <Row justify='center'>
        <Form.Item>
          <Text>Chưa phải thành viên? </Text>
          <Link onClick={() => setIsLoginMode(false)}>Đăng ký ngay</Link>
        </Form.Item>
      </Row>
    </>
  );

  const renderSignUpFooter = () => (
    <>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button block size='large' loading={auth.isLoading} type='primary' htmlType='submit'>
          Đăng ký
        </Button>
      </Form.Item>

      <Row justify='center'>
        <Form.Item>
          <Text>Đã có tài khoản? </Text>
          <Link onClick={() => setIsLoginMode(true)}>Đăng nhập</Link>
        </Form.Item>
      </Row>
    </>
  );

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

  useEffect(() => {
    if (!isLoginMode && form.isFieldsTouched('repassword')) {
      form.validateFields(['repassword']);
    } else {
      form.resetFields(['repassword']);
    }
  }, [form, isLoginMode]);

  return (
    <div className={styles.thisScreen}>
      <Form
        form={form}
        className={styles.form}
        name='basic'
        initialValues={{ remember: true }}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>
        <Form.Item wrapperCol={{ offset: 9 }}>
          <CommentOutlined style={{ fontSize: 64, color: colors.textSecondary }} />
        </Form.Item>

        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Bạn chưa nhập tài khoản!' }]}>
          <Input size='large' prefix={<UserOutlined />} placeholder='Tài khoản' />
        </Form.Item>

        {!isLoginMode && (
          <Form.Item
            name='displayname'
            rules={[{ required: true, message: 'Bạn chưa nhập nickname!' }]}>
            <Input size='large' prefix={<UserOutlined />} placeholder='Nickname' />
          </Form.Item>
        )}

        <Form.Item name='password' rules={[{ required: true, message: 'Bạn chưa nhập mật khẩu!' }]}>
          <Input.Password size='large' prefix={<LockOutlined />} placeholder='Mật khẩu' />
        </Form.Item>

        {!isLoginMode && (
          <Form.Item
            name='repassword'
            rules={[
              { required: true, message: 'Bạn chưa nhập lại mật khẩu!' },
              { pattern: new RegExp(password, 'g'), message: 'Mật khẩu không khớp!' },
            ]}>
            <Input.Password
              size='large'
              prefix={<LockOutlined />}
              placeholder='Nhập lại mật khẩu'
            />
          </Form.Item>
        )}

        <Form.Item name='remember' valuePropName='checked'>
          <Checkbox>Ghi nhớ</Checkbox>
        </Form.Item>

        {isLoginMode ? renderLoginFooter() : renderSignUpFooter()}
      </Form>
    </div>
  );
}
