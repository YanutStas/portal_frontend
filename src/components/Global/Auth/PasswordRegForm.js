import React from "react";
import { Button, Form, Input, Typography } from "antd";
import useRegistration from "../../../stores/useRegistration";

const { Paragraph } = Typography;

export default function PasswordRegForm() {
  const [form] = Form.useForm();
  const { registerUser } = useRegistration();

  const onFinish = (values) => {
    if (values.password !== values.repeat_password) {
      console.error("Пароли не совпадают.");
      return;
    }
    registerUser(values.password);
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Paragraph>
          Пароль должен содержать минимум 8 символов, заглавную букву, цифры,
          латинские буквы.
        </Paragraph>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              min: 10,
              message: "Минимальная длина пароля 10 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="repeat_password"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              min: 10,
              message: "Минимальная длина пароля 10 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
