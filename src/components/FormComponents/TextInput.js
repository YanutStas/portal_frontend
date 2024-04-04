import React, { useState } from "react";
import { Form, Input, Typography, Drawer, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import StrapiRichText from "../StrapiRichText";
import { formItemLayout } from "../../components/configSizeForm";

export default function TextInput({
  displayName,
  name,
  shortDescription,
  required,
  description,
  depends,
  inputProps,
}) {
  const { colorBorder, customfontSizeIcon } = theme.useToken().token;
  const form = Form.useFormInstance();
  const show = Form.useWatch(depends?.showIf.nameField, form);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  const iconStyle = {
    color: colorBorder,
    fontSize: customfontSizeIcon,
    cursor: "pointer",
    marginLeft: "5px",
  };

  if (show) {
    return (
      <>
        <Form.Item
          {...formItemLayout}
          name={name}
          label={<Typography.Text>{displayName}</Typography.Text>}
          rules={[{ required }]}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              placeholder={shortDescription}
              style={{ paddingRight: "30px" }}
              {...inputProps} // Дополнительные пропсы для Input
            />
            <InfoCircleOutlined style={iconStyle} onClick={showDrawer} />
          </div>
        </Form.Item>
        <Drawer
          title={displayName}
          placement="right"
          onClose={onClose}
          open={drawerVisible}
        >
          <StrapiRichText
            content={Array.isArray(description) ? description : [description]}
          />
        </Drawer>
      </>
    );
  }
}
