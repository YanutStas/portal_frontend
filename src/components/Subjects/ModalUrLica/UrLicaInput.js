import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, AutoComplete } from "antd";
import axios from "axios";
import config from "../../../config";

export default function UrLicaInput() {
  const [form] = Form.useForm();
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    console.log("Актуальный список предложений:", suggestions);
  }, [suggestions]);
  
  const onSearch = async (searchText) => {
    console.log("Ищем ИНН:", searchText);
    if (!searchText) {
      setSuggestions([]);
      return;
    }
    try {
      console.log("Делаем запрос по ИНН:", searchText);
      const response = await axios.get(
        `${config.backServer}/api/cabinet/get-inn/`,
        {
          params: { searchString: searchText },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      console.log("Ответ от сервера:", response.data);
      if (response.data && response.data.suggestions) {
        setSuggestions(
          response.data.suggestions.map((suggestion) => ({
            value: suggestion.data.inn,
            label: suggestion.value,
          }))
        );
        console.log("Установлены предложения для AutoComplete:", suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Ошибка при поиске организации:", error);
      setSuggestions([]);
    }
  };

  const onSelect = (value, option) => {
    const onSelect = (value, option) => {
      console.log("Выбрано значение:", value, "Опция AutoComplete:", option);
      // Обрати внимание, что мы устанавливаем `value`, а не `inn`, в значение формы
      form.setFieldsValue({ value: option.value });
    };
  };

  // const renderItem = (organization, index) => ({
  //   value: organization.data.inn,
  //   label: (
  //     <div
  //       key={index}
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //       }}
  //     >
  //       {organization.value}
  //     </div>
  //   ),
  // });

  const renderItem = (suggestion) => ({
    value: suggestion.data.inn, // Это значение будет использоваться в форме при выборе
    label: suggestion.value, // Это значение будет отображаться в выпадающем списке
  });

  

  return (
    <>
      <Divider orientation="center">ИНН</Divider>
      <Form form={form}>
        <Form.Item
          name="inn"
          label="ИНН"
          rules={[{ required: true, message: "Введите ИНН" }]}
        >
          <AutoComplete
            onSearch={onSearch}
            onSelect={onSelect}
            options={suggestions.map(renderItem)}
            notFoundContent="Ничего не найдено"
          >
            <Input placeholder="Введите ИНН для поиска" />
          </AutoComplete>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Divider, AutoComplete } from "antd";
// import axios from "axios";
// import config from "../../../config";

// export default function UrLicaInput() {
//   const [form] = Form.useForm();
//   const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     console.log("Updated suggestions:", suggestions);
//   }, [suggestions]);

//   const options = suggestions.map((suggestion, index) => ({
//     value: suggestion.value,
//     label: <div key={index}>{suggestion.label}</div>,
//   }));

//   const onSearch = async (searchText) => {
//     console.log("Ищем ИНН:", searchText);
//     if (!searchText) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       console.log("Делаем запрос по ИНН:", searchText);
//       const response = await axios.get(
//         `${config.backServer}/api/cabinet/get-inn/`,
//         {
//           params: { searchString: searchText },
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//           },
//         }
//       );
//       console.log("Ответ от сервера:", response.data);
//       if (response.data && response.data.suggestions) {
//         setSuggestions(
//           response.data.suggestions.map((suggestion) => ({
//             value: suggestion.data.inn,
//             label: suggestion.value,
//           }))
//         );
//         console.log("Установлены предложения для AutoComplete:", suggestions);
//       } else {
//         setSuggestions([]);
//       }
//     } catch (error) {
//       console.error("Ошибка при поиске организации:", error);
//       setSuggestions([]);
//     }
//   };

//   const onSelect = (value, option) => {
//     console.log("Выбрано значение:", value);
//     form.setFieldsValue({ inn: option.value });
//   };

//   const renderTitle = (title) => <span>{title}</span>;

//   const renderItem = (organization, index) => ({
//     value: organization.data.inn,
//     label: (
//       <div
//         key={index}
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         {organization.value}
//       </div>
//     ),
//   });

//   return (
//     <>
//       <Divider orientation="center">ИНН</Divider>
//       <Form form={form}>
//         <Form.Item
//           name="inn"
//           label="ИНН"
//           rules={[{ required: true, message: "Введите ИНН" }]}
//         >
//           <AutoComplete
//             onSearch={onSearch}
//             onSelect={onSelect}
//             options={options}
//             notFoundContent="Ничего не найдено"
//           >
//             <Input placeholder="Введите ИНН для поиска" />
//           </AutoComplete>

//           {/* <AutoComplete
//             // defaultValue=""
//             onSearch={onSearch}
//             onSelect={onSelect}
//             options={suggestions.map((suggestion, index) => renderItem(suggestion, index))}

//             notFoundContent="Ничего не найдено"
//           >
//             <Input placeholder="Введите ИНН для поиска" />
//           </AutoComplete> */}
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Добавить
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// }

// import { Form, Input, Button, Divider, Typography } from "antd";
// import axios from "axios";
// import config from "../../../config";

// export default function UrLicaInput() {
//   const [form] = Form.useForm();

//   //5032137342 - ИНН МосОблЭнерго
//   //7704217370 - ИНН Озон
//   const onFinish = async (values) => {
//     console.log("Отправленные данные ИНН:", values);
//     try {
//       const response = await axios.get(
//         `${config.backServer}/api/cabinet/get-inn/`,
//         {
//           params: { searchString: values.inn },
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//           },
//         }
//       );
//       console.log(response.data);
//       if (response.data && response.data.suggestions) {
//         console.log("Данные организации:", response.data.suggestions);
//       } else {
//         console.log("Нет данных организации для данного ИНН");
//       }
//     } catch (error) {
//       console.error("Ошибка при получении информации об организации:", error);
//     }
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log("Ошибка при отправке формы:", errorInfo);
//   };

//   return (
//     <>
//       <Divider orientation="center">ИНН</Divider>
//       <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
//         <Form.Item
//           name="inn"
//           label="ИНН"
//           rules={[{ required: true, message: "Пожалуйста, введите ИНН" }]}
//         >
//           <Input maxLength={12} placeholder="Введите ИНН" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Проверить
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// }
