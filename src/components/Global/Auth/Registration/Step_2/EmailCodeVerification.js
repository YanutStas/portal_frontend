import React, { useRef } from "react";
import { Form, Input,Typography } from "antd";
import Title from "antd/es/typography/Title";
import useRegistration from "../../../../../stores/useRegistration";
import styles from "./EmailCodeVerification.module.css"; // Убедитесь, что путь к CSS-файлу правильный

const EmailCodeVerification = () => {
  const submitEmailCode = useRegistration((state) => state.submitEmailCode);
  const formRef = useRef(null);
  const inputRefs = useRef([]);

  const onFinish = (values) => {
    const emailCode = Object.values(values).join("");
    submitEmailCode(emailCode);
  };

  const handleInputChange = (e, index) => {
    if (e.target.value.length === 1) {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      } else {
        formRef.current.submit();
      }
    }
  };

  return (
    <>
      <Title level={5}>Сейчас Вам поступит телефонный звонок, отвечать на него не нужно.</Title>
      <Typography.Text level={5}>Введите последние 4 цифры:</Typography.Text>
      <Form ref={formRef} onFinish={onFinish} className={styles.codeFormContainer}>
        {Array.from({ length: 4 }, (_, index) => (
          <Form.Item
            key={index}
            name={`pin${index + 1}`}
            rules={[{ required: true, message: "Введите цифру" }]}
          >
            <Input
              className={styles.codeInput}
              ref={(el) => (inputRefs.current[index] = el)}
              maxLength={1}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Form.Item>
        ))}
      </Form>
    </>
  );
};

export default EmailCodeVerification;

// import React from "react";
// import { Form, Input, Button } from "antd";
// import useRegistration from "../../../../../stores/useRegistration";

// const EmailCodeVerification = () => {
//   const submitEmailCode = useRegistration((state) => state.submitEmailCode);

//   const onFinish = (values) => {
//     submitEmailCode(values.emailCode);
//   };

//   return (
//     <Form onFinish={onFinish}>
//       <Form.Item
//         name="emailCode"
//         rules={[{ required: true, message: "Пожалуйста, введите пин-код!" }]}
//       >
//         <Input placeholder="Пин-код" />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Подтвердить
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default EmailCodeVerification;
