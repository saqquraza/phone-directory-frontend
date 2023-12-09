import { Col, Form, Input, message, Modal, Row } from 'antd'
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { apiTypes } from '../Service/apiTypes';
import { BACKEND_URI } from '../constant';

interface Props {
  onClose: () => void;
  open: boolean;
  modalTitle: string;
  id?: string;
  isEditMode?: boolean;
  fetchData: () => Promise<void>;
}


const ApiUserModal: React.FC<Props> = ({
  onClose,
  open,
  id,
  isEditMode,
  fetchData
}) => {
  const [form] = useForm();
  const [userDetails, setUserDetails] = useState<any>({});
  // const BASE_URL = 'http://localhost:4000/phonedirectory'

  const fetchUserDetailsById = async () => {
    if (id!=='0') {
      try {
        const clientNotesResp = await axios.get(`${BACKEND_URI}/${id}`);
        setUserDetails(clientNotesResp.data[0]);
      } catch (err: any) {
        console.error(false);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetailsById();
    }
  }, [id]);


  useEffect(() => {
    if (userDetails) {
      form.setFieldValue("firstName", userDetails?.firstName);
      form.setFieldValue("lastName", userDetails?.lastName);
      form.setFieldValue("age", userDetails?.age);
      form.setFieldValue("phoneNumber", userDetails?.phone);
    }
  }, [userDetails]);

  const handleEditUserDetail = async (value: apiTypes) => {
    if (id) {
      try {
        const resp = await axios.patch(`${BACKEND_URI}/${id}`, value);
        await fetchData();
        form.resetFields();
        onClose();
      } catch (err: any) {
        console.error(err);
        message.error(err?.response?.data?.message || "Something went wrong!");
      }
    }
  };

  const handleSubmit = async (value: apiTypes) => {
    {
      try {
        const resp = await axios.post(`${BACKEND_URI}`, {
          firstName: value.firstName,
          lastName: value.lastName,
          age: parseInt(value?.age),
          phone: parseInt(value?.phoneNumber)
        });
        const res = await fetchData();
        form.resetFields();
        onClose();
        message.success(
          resp?.data?.message || "Added User info successfully"
        );
      } catch (error: any) {
        message.error(error.response?.data?.message || "Something went wrong!");

      }
    }
  };
  const resetStates = () => {
    setUserDetails({} as any)
    form.resetFields();
  }

  return (
    <Modal
      title="User Info"
      open={open}
      onCancel={() => {
        onClose();
        resetStates()
      }}
      onOk={() => form.submit()}
      okText={'Save'}
      cancelText={'Cancel'}
    >
      <Form
        layout="vertical"
        onFinish={isEditMode && id ? handleEditUserDetail : handleSubmit}
        form={form}
      >
        <Row gutter={[20, 0]}>
          <Col xs={24} >
            <Form.Item label="First Name" name={"firstName"} rules={[{ required: true, message: 'Please enter First name!' }]}>
              <Input
                placeholder="Enter first name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} >
            <Form.Item label="Last Name" name={"lastName"} rules={[{ required: true, message: 'Please enter support details!' }]}>
              <Input
                placeholder="Enter last Names"
              />
            </Form.Item>
          </Col>
          <Col xs={24} >
            <Form.Item label="Age" name={"age"} rules={[{ required: true, message: 'Please enter support details!' }]}>
              <Input
                type='number'
                placeholder="Enter age"
              />
            </Form.Item>
          </Col>
          <Col xs={24} >
            <Form.Item label="Phone Number" name={"phoneNumber"} rules={[{ required: true, message: 'Please enter support details!' }]}>
              <Input
                type='number'
                placeholder="Enter phoneNumber"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

    </Modal>

  )
}

export default ApiUserModal