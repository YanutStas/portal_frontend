import React, { useState, useEffect } from "react";

import { Form, Button, message } from "antd";
import moment from "moment";

import useAuth from "../../../stores/./useAuth";
import useRegistration from "../../.././stores/useRegistration";
import useSubjects from "../../../stores/Cabinet/useSubjects";

import { formItemLayout } from "../../.././components/configSizeForm";

import Uploader from "../../../components/FormComponents/Uploader";
import FullName from "../../../components/Subjects/FullName";
import ConfirmationDocument from "../../../components/Subjects/ConfirmationDocument";
import Snils from "../../../components/Subjects/Snils";
import Contacts from "../../../components/Subjects/Contacts";
import AddressRegistration from "../../../components/Subjects/AddressRegistration";
import AddressResidential from "../../../components/Subjects/AddressResidential";

export default function ModalFizLica({
  onSubmit,
  setShowModalAdd,
  read = false,
  value = {},
}) {
  const [searchText] = useState("");
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();
  const { submitNewSubject, debouncedFetchAddresses } = useSubjects();
  //console.log(value)
  const onFinish = async (values) => {
    console.log(values);
    let addressRegistration = {};
    if (values.manual == "1") {
      addressRegistration = {
        manual: {
          countryRegistration: values.countryRegistration,
          postcodeRegistration: values.postcodeRegistration,
          regionRegistration: values.regionRegistration,
          areaRegistration: values.areaRegistration,
          cityRegistration: values.cityRegistration,
          localityRegistration: values.localityRegistration,
          streetRegistration: values.streetRegistration,
          houseNumberRegistration: values.houseNumberRegistration,
          frameRegistration: values.frameRegistration,
          buildingRegistration: values.buildingRegistration,
          apartmentNumberRegistration: values.apartmentNumberRegistration,
          kommentRegistration: values.kommentRegistration,
        },
      };
    } else {
      addressRegistration = {
        fias: {
          fullAddress: values.fullAddress,
          fiasId: values.fiasId,
        },
      };
    }

    let addressResidential = {};
    if (values.manualResidential === '1') {
      addressResidential = {
        manualResidential: {
          countryResidential: values.countryResidential,
          postcodeResidential: values.postcodeResidential,
          regionResidential: values.regionResidential,
          areaResidential: values.areaResidential,
          cityResidential: values.cityResidential,
          localityResidential: values.localityResidential,
          streetResidential: values.streetResidential,
          houseNumberResidential: values.houseNumberResidential,
          frameResidential: values.frameResidential,
          buildingResidential: values.buildingResidential,
          apartmentNumberResidential: values.apartmentNumberResidential,
          kommentResidential: values.kommentResidential,
        },
      };
    } else {
      addressResidential = {
        fias: {
          fullAddressResidential: values.fullAddressResidential,
          fiasIdResidential: values.fiasIdResidential,
        },
      };
    }


    const formData = {
      type: "Физическое лицо",
      firstname: values.firstname,
      lastname: values.lastname,
      secondname: values.secondname,
      snils: values.snils.replace(/[^0-9]/g, ""),
      typeDoc: values.typeDoc,
      serialPassport: values.serialPassport,
      numberPassport: values.numberPassport,
      kodPodrazdelenia: values.kodPodrazdelenia,
      kemVidan: values.kemVidan,
      dateIssue: values.dateIssue,
      typeOtherDoc: values.typeOtherDoc,
      recvizityOthetDoc: values.recvizityOthetDoc,
      kemVidanOthetDoc: values.kemVidanOthetDoc,
      dateIssueOthetDoc: values.dateIssueOthetDoc,
      fileDoc: values.fileDoc,
      addressRegistration,
      addressResidential,
      phone: values.phone,
      email: values.email,
    };
    console.log(formData);

    try {
      await submitNewSubject(formData);
      message.success("Субъект успешно создан");
      form.resetFields();
      setShowModalAdd(false);
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Состояние авторизации пользователя
  const authState = useAuth((state) => ({
    phone: state.phone,
    email: state.email,
  }));

  // Состояние регистрации пользователя
  const registrationState = useRegistration((state) => ({
    phone: state.phone,
    email: state.email,
  }));

  useEffect(() => {
    debouncedFetchAddresses(searchText);
  }, [searchText, debouncedFetchAddresses]);

  const userPhone = authState.phone || registrationState.phone;
  const userEmail = authState.email || registrationState.email;

  return (
    <Form
      form={form}
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        phone: userPhone || "",
        email: userEmail || "",
        dateIssue: value.dateIssue
          ? moment(value.dateIssue, "DD.MM.YYYY")
          : null,
        dateIssueOthetDoc: value.dateIssueOthetDoc
          ? moment(value.dateIssueOthetDoc, "DD.MM.YYYY")
          : null,
        typeDoc: "Паспорт гражданина РФ",
      }}
    >
      {/* _______ФИО_______ */}
      <FullName
        read={read}
        value={{
          firstname: value.firstname,
          lastname: value.lastname,
          secondname: value.secondname,
        }}
      />
      {/* _______Подтверждающий документ_______ */}
      <ConfirmationDocument
        read={read}
        value={{
          typeDoc: value.typeDoc,
          serialPassport: value.passport?.serialPassport,
          numberPassport: value.passport?.numberPassport,
          kodPodrazdelenia: value.passport?.kodPodrazdelenia,
          kemVidan: value.passport?.kemVidan,
          dateIssue: value.passport?.dateIssue,
          typeOtherDoc: value.otherDoc?.typeOtherDoc,
          recvizityOthetDoc: value.otherDoc?.recvizityOthetDoc,
          kemVidanOthetDoc: value.otherDoc?.kemVidanOthetDoc,
          dateIssueOthetDoc: value.otherDoc?.dateIssueOthetDoc,
        }}
        form={form}
      />
      {/* _______Блок с адресами_______ */}
      <AddressRegistration
        read={read}
        form={form}
        value={value.addressRegistration}
      />
      <AddressResidential
        read={read}
        form={form}
        value={value.addressResidential}
      />
      {/* _______Загрузка_______ */}
      <Uploader
        read={read}
        fileList={fileList}
        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        form={form}
        value={{
          fileDoc: value?.fileDoc,
        }}
      />

      {/* <Uploader
        read={read}
        fileList={fileList}
        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        form={form}
        value={{
          fileDoc: value.fileDoc,
        }}
      /> */}
      {/* _______СНИЛС_______ */}
      <Snils
        read={read}
        form={form}
        value={{
          snils: value.snils,
        }}
      />

      {/* _______Блок с телефоном и почтой_______ */}
      <Contacts
        read={read}
        form={form}
        value={{
          phone: value.phone,
          email: value.email,
        }}
      />

      {/* _______Кнопка отправки формы_______ */}
      {!read && (
        <Form.Item>
          <Button type="primary" onClick={() => form.submit()}>
            Добавить
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

// import React, { useState, useEffect } from "react";

// import { Form, Button, message } from "antd";
// import moment from "moment";

// import useAuth from "../../../stores/./useAuth";
// import useRegistration from "../../.././stores/useRegistration";
// import useSubjects from "../../../stores/Cabinet/useSubjects";

// import { formItemLayout } from "../../.././components/configSizeForm";

// import Uploader from "../../../components/FormComponents/Uploader";
// import FullName from "../../../components/Subjects/FullName";
// import ConfirmationDocument from "../../../components/Subjects/ConfirmationDocument";
// import Snils from "../../../components/Subjects/Snils";
// import Contacts from "../../../components/Subjects/Contacts";
// import AddressRegistration from "../../../components/Subjects/AddressRegistration";
// import AddressResidential from "../../../components/Subjects/AddressResidential";

// export default function ModalFizLica({
//   onSubmit,
//   setShowModalAdd,
//   read = false,
//   value = {},
// }) {
//   const [searchText] = useState("");
//   const [fileList, setFileList] = useState([]);

//   const [form] = Form.useForm();
//   const { submitNewSubject, debouncedFetchAddresses } = useSubjects();
//   //console.log(value)
//   const onFinish = async (values) => {
//     console.log(values);
//     let addressRegistration = {}
//     if (values.manual == "1") {
//       addressRegistration = {
//         manual: {
//           countryRegistration: values.countryRegistration,
//           postcodeRegistration: values.postcodeRegistration,
//           regionRegistration: values.regionRegistration,
//           areaRegistration: values.areaRegistration,
//           cityRegistration: values.cityRegistration,
//           localityRegistration: values.localityRegistration,
//           streetRegistration: values.streetRegistration,
//           houseNumberRegistration: values.houseNumberRegistration,
//           frameRegistration: values.frameRegistration,
//           buildingRegistration: values.buildingRegistration,
//           apartmentNumberRegistration: values.apartmentNumberRegistration,
//           kommentRegistration: values.kommentRegistration,
//         }
//       }
//     } else {
//       addressRegistration = {
//         fias: {
//           fullAddress: values.fullAddress,
//           fiasId: values.fiasId
//         }
//       }
//     }

//     const formData = {
//       type: "Физическое лицо",
//       firstname: values.firstname,
//       lastname: values.lastname,
//       secondname: values.secondname,
//       snils: values.snils.replace(/[^0-9]/g, ""),
//       typeDoc: values.typeDoc,
//       serialPassport: values.serialPassport,
//       numberPassport: values.numberPassport,
//       kodPodrazdelenia: values.kodPodrazdelenia,
//       kemVidan: values.kemVidan,
//       dateIssue: values.dateIssue,
//       typeOtherDoc: values.typeOtherDoc,
//       recvizityOthetDoc: values.recvizityOthetDoc,
//       kemVidanOthetDoc: values.kemVidanOthetDoc,
//       dateIssueOthetDoc: values.dateIssueOthetDoc,
//       fileDoc: values.fileDoc,
//       addressRegistration,
//       addressResidential: values.addressResidential,
//       //addressRegistrationFias: values.addressRegistrationFias,
//       //addressResidentialFias: values.addressResidentialFias,
//       phone: values.phone,
//       email: values.email,
//     };
//     console.log(formData);

//     try {
//       await submitNewSubject(formData);
//       message.success("Субъект успешно создан");
//       form.resetFields();
//       setShowModalAdd(false);
//       if (onSubmit) {
//         onSubmit();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Состояние авторизации пользователя
//   const authState = useAuth((state) => ({
//     phone: state.phone,
//     email: state.email,
//   }));

//   // Состояние регистрации пользователя
//   const registrationState = useRegistration((state) => ({
//     phone: state.phone,
//     email: state.email,
//   }));

//   useEffect(() => {
//     debouncedFetchAddresses(searchText);
//   }, [searchText, debouncedFetchAddresses]);

//   const userPhone = authState.phone || registrationState.phone;
//   const userEmail = authState.email || registrationState.email;

//   return (
//     <Form
//       form={form}
//       {...formItemLayout}
//       onFinish={onFinish}
//       initialValues={{
//         // phone: userPhone,
//         // email: userEmail,
//         // typeDoc: "passport",
//         phone: userPhone || "",
//         email: userEmail || "",
//         dateIssue: value.dateIssue
//           ? moment(value.dateIssue, "DD.MM.YYYY")
//           : null,
//         dateIssueOthetDoc: value.dateIssueOthetDoc
//           ? moment(value.dateIssueOthetDoc, "DD.MM.YYYY")
//           : null,
//         typeDoc: "Паспорт гражданина РФ",
//       }}
//     >
//       {/* _______ФИО_______ */}
//       <FullName
//         read={read}
//         value={{
//           firstname: value.firstname,
//           lastname: value.lastname,
//           secondname: value.secondname,
//         }}
//       />
//       {/* _______Подтверждающий документ_______ */}
//       <ConfirmationDocument
//         read={read}
//         value={{
//           typeDoc: value.typeDoc,
//           serialPassport: value.passport?.serialPassport,
//           numberPassport: value.passport?.numberPassport,
//           kodPodrazdelenia: value.passport?.kodPodrazdelenia,
//           kemVidan: value.passport?.kemVidan,
//           dateIssue: value.passport?.dateIssue,
//           typeOtherDoc: value.otherDoc?.typeOtherDoc,
//           recvizityOthetDoc: value.otherDoc?.recvizityOthetDoc,
//           kemVidanOthetDoc: value.otherDoc?.kemVidanOthetDoc,
//           dateIssueOthetDoc: value.otherDoc?.dateIssueOthetDoc,
//         }}
//         form={form}
//       />
//       {/* _______Блок с адресами_______ */}
//       <AddressRegistration
//         read={read}
//         form={form}
//         value={value.addressRegistration}
//       />
//       <AddressResidential
//         read={read}
//         form={form}
//         value={{
//           addressResidential: value?.addressResidential,
//         }}
//       />
//       {/* _______Загрузка_______ */}
//       <Uploader
//         read={read}
//         fileList={fileList}
//         onChange={({ fileList: newFileList }) => setFileList(newFileList)}
//         form={form}
//         value={{
//           fileDoc: value?.fileDoc,
//         }}
//       />

//       {/* <Uploader
//         read={read}
//         fileList={fileList}
//         onChange={({ fileList: newFileList }) => setFileList(newFileList)}
//         form={form}
//         value={{
//           fileDoc: value.fileDoc,
//         }}
//       /> */}
//       {/* _______СНИЛС_______ */}
//       <Snils
//         read={read}
//         form={form}
//         value={{
//           snils: value.snils,
//         }}
//       />

//       {/* _______Блок с телефоном и почтой_______ */}
//       <Contacts
//         read={read}
//         form={form}
//         value={{
//           phone: value.phone,
//           email: value.email,
//         }}
//       />

//       {/* _______Кнопка отправки формы_______ */}
//       {!read &&
//         <Form.Item>
//           <Button type="primary" onClick={() => form.submit()}>
//             Добавить
//           </Button>
//         </Form.Item>
//       }
//     </Form>
//   );
// }
