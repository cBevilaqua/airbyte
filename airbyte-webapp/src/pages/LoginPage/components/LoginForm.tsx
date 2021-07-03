import React from "react";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldProps, Form, Formik } from "formik";
import * as yup from "yup";

import { BigButton } from "components/CenteredPageComponents";
import LabeledInput from "components/LabeledInput";

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 38px;
`;

const FormItem = styled.div`
  margin-bottom: 28px;
`;

export type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
};

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("form.email.error").required("form.empty.error"),
});

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const formatMessage = useIntl().formatMessage;

  return (
    <Formik
      validateOnBlur={true}
      validateOnChange={false}
      validationSchema={loginValidationSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    >
      {({ isSubmitting, handleChange, setFieldValue, resetForm }) => (
        <Form>
          <FormItem>
            <Field name="email">
              {({ field, meta }: FieldProps<string>) => (
                <LabeledInput
                  {...field}
                  label={<FormattedMessage id="form.yourEmail" />}
                  placeholder={formatMessage({
                    id: "form.email.placeholder",
                  })}
                  type="email"
                  error={!!meta.error && meta.touched}
                  message={
                    meta.touched &&
                    meta.error &&
                    formatMessage({ id: meta.error })
                  }
                  onChange={(event) => {
                    handleChange(event);
                    if (
                      field.value.length === 0 &&
                      event.target.value.length > 0
                    ) {
                      setFieldValue("securityUpdates", true);
                    } else if (
                      field.value.length > 0 &&
                      event.target.value.length === 0
                    ) {
                      resetForm();
                      setFieldValue("email", "");
                    }
                  }}
                />
              )}
            </Field>
          </FormItem>
          <FormItem>
            <Field name="password">
              {({ field, meta }: FieldProps<string>) => (
                <LabeledInput
                  {...field}
                  label={<FormattedMessage id="Password" />}
                  placeholder={formatMessage({
                    id: "Password",
                  })}
                  type="password"
                  error={!!meta.error && meta.touched}
                  message={
                    meta.touched &&
                    meta.error &&
                    formatMessage({ id: meta.error })
                  }
                  onChange={(event) => {
                    handleChange(event);
                    if (
                      field.value.length === 0 &&
                      event.target.value.length > 0
                    ) {
                      setFieldValue("securityUpdates", true);
                    } else if (
                      field.value.length > 0 &&
                      event.target.value.length === 0
                    ) {
                      resetForm();
                      setFieldValue("password", "");
                    }
                  }}
                />
              )}
            </Field>
          </FormItem>
          <ButtonContainer>
            <BigButton type="submit" disabled={isSubmitting}>
              <FormattedMessage id={"form.continue"} />
            </BigButton>
          </ButtonContainer>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
